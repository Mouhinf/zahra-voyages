'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDbInstance } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { VoyageCroisiere } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/cloudinary';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Loader2, Trash2 } from 'lucide-react';

const formSchema = z.object({
  titre: z.string().min(2, 'Le titre doit contenir au moins 2 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  prix: z.string().min(3, 'Veuillez entrer un prix.'),
  tag: z.string().min(2, 'Veuillez entrer une catégorie.'),
  type: z.enum(['voyage', 'croisiere']),
  destination: z.string().min(2, 'Veuillez entrer une destination.'),
  duree: z.string().min(2, 'Veuillez entrer une durée.'),
  dateDepart: z.string(),
  inclus: z.string(),
  nonInclus: z.string(),
  disponible: z.boolean().default(true),
  ordre: z.coerce.number().default(0),
  image: z.instanceof(FileList).refine((files) => files?.length === 1, 'Une image est requise.'),
});

export default function VoyagesCroisieresManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<VoyageCroisiere[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: '', description: '', prix: '', tag: '', type: 'voyage',
      destination: '', duree: '', dateDepart: 'Sur demande', inclus: '', nonInclus: '',
      disponible: true, ordre: 0,
    },
  });

  useEffect(() => {
    const q = query(collection(getDbInstance(), 'voyagesCroisieres'), orderBy('ordre', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data: VoyageCroisiere[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as VoyageCroisiere));
      setItems(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      setUploadProgress(50);
      const { secure_url, public_id } = await uploadImageToCloudinary(values.image[0]);
      setUploadProgress(100);
      await addDoc(collection(getDbInstance(), 'voyagesCroisieres'), {
        titre: values.titre, description: values.description, prix: values.prix, tag: values.tag,
        type: values.type, destination: values.destination, duree: values.duree, dateDepart: values.dateDepart,
        inclus: values.inclus.split(',').map((s) => s.trim()).filter(Boolean),
        nonInclus: values.nonInclus.split(',').map((s) => s.trim()).filter(Boolean),
        disponible: values.disponible, ordre: values.ordre, image: secure_url, public_id,
      });
      toast({ title: 'Succès !', description: 'Le voyage / la croisière a été ajouté(e).' });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur :', error);
      toast({ title: 'Erreur', description: "Une erreur est survenue lors de l'ajout.", variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete(id: string, public_id: string) {
    setDeletingId(id);
    try {
      await deleteImageFromCloudinary(public_id);
      await deleteDoc(doc(getDbInstance(), 'voyagesCroisieres', id));
      toast({ title: 'Supprimé', description: "Le voyage / la croisière a été supprimé(e)." });
    } catch (error) {
      console.error('Erreur :', error);
      toast({ title: 'Erreur', description: 'Suppression impossible.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Gérer les Voyages & Croisières</h2>
          <p className="text-muted-foreground">Ajoutez les voyages et croisières de votre site.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau Voyage / Croisière</DialogTitle>
              <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="titre" render={({ field }) => (
                  <FormItem><FormLabel>Titre</FormLabel><FormControl><Input placeholder="Séjour Paris 7 jours" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description courte</FormLabel><FormControl><Textarea placeholder="Un séjour inoubliable à Paris..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="prix" render={({ field }) => (
                    <FormItem><FormLabel>Prix</FormLabel><FormControl><Input placeholder="À partir de 850 000 XOF" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="tag" render={({ field }) => (
                    <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input placeholder="Europe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="voyage">Voyage</SelectItem>
                          <SelectItem value="croisiere">Croisière</SelectItem>
                        </SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="destination" render={({ field }) => (
                    <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="Paris" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="duree" render={({ field }) => (
                    <FormItem><FormLabel>Durée</FormLabel><FormControl><Input placeholder="7 jours / 6 nuits" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="dateDepart" render={({ field }) => (
                    <FormItem><FormLabel>Date de départ</FormLabel><FormControl><Input placeholder="Sur demande" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="inclus" render={({ field }) => (
                  <FormItem><FormLabel>Inclus (séparés par virgules)</FormLabel><FormControl><Input placeholder="Vol aller-retour, Hôtel 4*" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="nonInclus" render={({ field }) => (
                  <FormItem><FormLabel>Non inclus (séparés par virgules)</FormLabel><FormControl><Input placeholder="Visa, Activités optionnelles" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="ordre" render={({ field }) => (
                    <FormItem><FormLabel>Ordre d'affichage</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="disponible" render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3 pt-6">
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="!mt-0">Disponible</FormLabel>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem><FormLabel>Image</FormLabel><FormControl><Input type="file" accept="image/*" {...form.register('image')} /></FormControl><FormMessage /></FormItem>
                )} />
                {isUploading && <Progress value={uploadProgress} className="w-full" />}
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Ajouter
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
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Image src={item.image} alt={item.titre} width={64} height={64} className="rounded-md object-cover h-16 w-16" /></TableCell>
                  <TableCell className="font-medium">{item.titre}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.destination}</TableCell>
                  <TableCell>{item.prix}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.public_id)} disabled={deletingId === item.id}>
                      {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Aucun voyage ou croisière trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
