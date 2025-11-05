'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Destination } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  price: z.string().min(5, { message: 'Veuillez entrer un prix valide.' }),
  tag: z.string().min(2, { message: 'Veuillez entrer une catégorie.' }),
  image: z.instanceof(FileList).refine((files) => files?.length === 1, 'Une image est requise.'),
});

export default function DestinationsManager() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 'À partir de ',
      tag: '',
    },
  });

  useEffect(() => {
    const q = query(collection(db, 'destinations'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const destinationsData: Destination[] = [];
      querySnapshot.forEach((doc) => {
        destinationsData.push({ id: doc.id, ...doc.data() } as Destination);
      });
      setDestinations(destinationsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    setUploadProgress(0);

    const imageFile = values.image[0];
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      setUploadProgress(50);
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Image upload failed');
      }

      const { secure_url, public_id } = await uploadResponse.json();
      setUploadProgress(100);

      await addDoc(collection(db, 'destinations'), {
        name: values.name,
        price: values.price,
        tag: values.tag,
        image: secure_url,
        public_id: public_id,
      });

      toast({
        title: 'Succès !',
        description: 'La destination a été ajoutée.',
      });

      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'ajout de la destination.",
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const openDeleteConfirm = (destination: Destination) => {
    setDestinationToDelete(destination);
    setIsAlertOpen(true);
  };

  const handleDelete = async () => {
    if (!destinationToDelete) return;

    try {
      // Supprimer l'image de Cloudinary
      const deleteResponse = await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: destinationToDelete.public_id }),
      });

      if (!deleteResponse.ok) {
        // On continue même si la suppression de l'image échoue pour ne pas bloquer l'utilisateur
        console.warn("La suppression de l'image sur Cloudinary a peut-être échoué, mais nous continuons.");
      }

      // Supprimer le document de Firestore
      await deleteDoc(doc(db, 'destinations', destinationToDelete.id));

      toast({
        title: 'Succès !',
        description: 'La destination a été supprimée.',
      });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la suppression.",
        variant: 'destructive',
      });
    } finally {
      setIsAlertOpen(false);
      setDestinationToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-semibold">Gérer les Destinations</h2>
            <p className="text-muted-foreground">Ajoutez, modifiez ou supprimez les destinations de votre site.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une destination
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle Destination</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter une nouvelle destination.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Paris, France" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Prix</FormLabel><FormControl><Input placeholder="À partir de 300 000 XOF" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tag" render={({ field }) => (
                  <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input placeholder="Europe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem><FormLabel>Image</FormLabel><FormControl><Input type="file" accept="image/*" {...form.register('image')} /></FormControl><FormMessage /></FormItem>
                )} />
                {isUploading && <Progress value={uploadProgress} className="w-full" />}
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ajouter
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : destinations.length > 0 ? (
              destinations.map((dest) => (
                <TableRow key={dest.id}>
                  <TableCell>
                    <Image src={dest.image} alt={dest.name} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                  </TableCell>
                  <TableCell className="font-medium">{dest.name}</TableCell>
                  <TableCell>{dest.price}</TableCell>
                  <TableCell>{dest.tag}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(dest)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center h-24">Aucune destination trouvée.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La destination "{destinationToDelete?.name}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}