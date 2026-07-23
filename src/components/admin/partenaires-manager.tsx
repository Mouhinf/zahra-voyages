'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDbInstance } from '@/lib/firebase';
import { collection, addDoc, updateDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Partenaire } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/cloudinary';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Loader2, Trash2, Pencil } from 'lucide-react';

const formSchema = z.object({
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  ordre: z.coerce.number().int().min(0).default(0),
  logo: z.custom<FileList>((value) => typeof FileList !== 'undefined' && value instanceof FileList).refine((files) => files?.length === 1, 'Un logo est requis.'),
});

export default function PartenairesManager() {
  const { toast } = useToast();
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partenaire | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nom: '', ordre: 0 },
  });

  useEffect(() => {
    const q = query(collection(getDbInstance(), 'partenaires'), orderBy('ordre', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: Partenaire[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Partenaire);
      });
      setPartenaires(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function openAdd() {
    setEditingItem(null);
    form.reset({ nom: '', ordre: 0 });
    setIsDialogOpen(true);
  }

  function openEdit(item: Partenaire) {
    setEditingItem(item);
    form.reset({ nom: item.nom, ordre: item.ordre });
    setIsDialogOpen(true);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      setUploadProgress(30);
      const { secure_url, public_id } = await uploadImageToCloudinary(values.logo[0]);
      setUploadProgress(90);

      const dataToSave = {
        nom: values.nom,
        logo: secure_url,
        public_id,
        ordre: values.ordre,
      };

      if (editingItem) {
        if (editingItem.public_id) await deleteImageFromCloudinary(editingItem.public_id);
        await updateDoc(doc(getDbInstance(), 'partenaires', editingItem.id), dataToSave);
        toast({ title: 'Succès !', description: 'Le partenaire a été mis à jour.' });
      } else {
        await addDoc(collection(getDbInstance(), 'partenaires'), dataToSave);
        toast({ title: 'Succès !', description: 'Le partenaire a été ajouté.' });
      }

      form.reset();
      setEditingItem(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete(id: string, public_id: string) {
    setDeletingId(id);
    try {
      if (public_id) await deleteImageFromCloudinary(public_id);
      await deleteDoc(doc(getDbInstance(), 'partenaires', id));
      toast({ title: 'Supprimé', description: 'Le partenaire a été supprimé.' });
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({ title: 'Erreur', description: 'Suppression impossible.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Gérer les Partenaires</h2>
          <p className="text-muted-foreground">Ajoutez les logos de vos partenaires (affichés sur la page d'accueil).</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un partenaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Modifier le partenaire' : 'Nouveau Partenaire'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Modifiez les informations du partenaire.' : 'Ajoutez un nouveau partenaire avec son logo.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="nom" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du partenaire</FormLabel>
                    <FormControl><Input placeholder="Air France" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ordre" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre d'affichage</FormLabel>
                    <FormControl><Input type="number" min={0} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="logo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo du partenaire</FormLabel>
                    <FormControl><Input type="file" accept="image/*" {...form.register('logo')} /></FormControl>
                    <FormMessage />
                    {editingItem && (
                      <p className="text-xs text-muted-foreground">Un nouveau logo remplacera l'ancien.</p>
                    )}
                  </FormItem>
                )} />
                {isUploading && <Progress value={uploadProgress} className="w-full" />}
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingItem ? 'Mettre à jour' : 'Ajouter'}
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
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="w-[80px]">Ordre</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : partenaires.length > 0 ? (
              partenaires.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="relative h-12 w-16 bg-muted/30 rounded-md overflow-hidden">
                      <Image src={p.logo} alt={p.nom} fill className="object-contain p-1" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{p.nom}</TableCell>
                  <TableCell>{p.ordre}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id, p.public_id)} disabled={deletingId === p.id}>
                        {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center h-24">Aucun partenaire trouvé. Ajoutez-en pour les afficher sur la page d'accueil.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
