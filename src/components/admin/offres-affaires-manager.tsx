'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDbInstance } from '@/lib/firebase';
import { collection, addDoc, updateDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { OffreAffaires } from '@/types';
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
import { PlusCircle, Loader2, Trash2, Pencil, X } from 'lucide-react';
import { ImagePreview } from '@/components/admin/image-preview';

const formSchema = z.object({
  titre: z.string().min(2, 'Le titre doit contenir au moins 2 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  descriptionComplete: z.string().optional(),
  prix: z.string().min(3, 'Veuillez entrer un prix.'),
  tag: z.string().min(2, 'Veuillez entrer une catégorie.'),
  type: z.enum(['tourisme_religieux', 'tourisme_local', 'tourisme_linguistique', 'tourisme_affaires']),
  capacite: z.string().min(2, 'Veuillez entrer une capacité.'),
  lieu: z.string().min(2, 'Veuillez entrer un lieu.'),
  duree: z.string().min(2, 'Veuillez entrer une durée.'),
  services: z.string(),
  disponible: z.boolean().default(true),
  ordre: z.coerce.number().default(0),
  image: z.custom<FileList>((value) => typeof FileList !== 'undefined' && value instanceof FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function OffresAffairesManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<OffreAffaires[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OffreAffaires | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: '', description: '', descriptionComplete: '', prix: '', tag: '', type: 'tourisme_affaires',
      capacite: '', lieu: '', duree: '', services: '',
      disponible: true, ordre: 0,
    },
  });

  useEffect(() => {
    const q = query(collection(getDbInstance(), 'offresAffaires'), orderBy('ordre', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data: OffreAffaires[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as OffreAffaires));
      setItems(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function openAddDialog() {
    setEditingItem(null);
    setGalleryFiles([]);
    setMainImageFile(null);
    form.reset({
      titre: '', description: '', descriptionComplete: '', prix: '', tag: '', type: 'tourisme_affaires',
      capacite: '', lieu: '', duree: '', services: '',
      disponible: true, ordre: 0,
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(item: OffreAffaires) {
    setEditingItem(item);
    setGalleryFiles([]);
    setMainImageFile(null);
    form.reset({
      titre: item.titre,
      description: item.description,
      descriptionComplete: item.descriptionComplete || '',
      prix: item.prix,
      tag: item.tag,
      type: ['seminaire', 'incentive', 'mice', 'mission_sur_mesure'].includes(item.type) ? 'tourisme_affaires' : item.type,
      capacite: item.capacite,
      lieu: item.lieu,
      duree: item.duree,
      services: (item.services || []).join(', '),
      disponible: item.disponible,
      ordre: item.ordre,
    });
    setIsDialogOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      let imageUrl = editingItem?.image || '';
      let publicId = editingItem?.public_id || '';
      let galleryImages = editingItem?.images || [];

      if (values.image && values.image.length > 0) {
        setUploadProgress(30);
        const uploaded = await uploadImageToCloudinary(values.image[0]);
        imageUrl = uploaded.secure_url;
        publicId = uploaded.public_id;
      }

      if (galleryFiles.length > 0) {
        setUploadProgress(50);
        const uploadedImages: string[] = [];
        for (let i = 0; i < galleryFiles.length; i++) {
          const { secure_url } = await uploadImageToCloudinary(galleryFiles[i]);
          uploadedImages.push(secure_url);
          setUploadProgress(50 + Math.round(((i + 1) / galleryFiles.length) * 40));
        }
        galleryImages = [...galleryImages, ...uploadedImages];
      }

      setUploadProgress(95);
      const dataToSave = {
        titre: values.titre,
        description: values.description,
        descriptionComplete: values.descriptionComplete || '',
        prix: values.prix,
        tag: values.tag,
        type: values.type,
        capacite: values.capacite,
        lieu: values.lieu,
        duree: values.duree,
        services: values.services.split(',').map((s) => s.trim()).filter(Boolean),
        disponible: values.disponible,
        ordre: values.ordre,
        image: imageUrl,
        public_id: publicId,
        images: galleryImages,
      };

      if (editingItem) {
        await updateDoc(doc(getDbInstance(), 'offresAffaires', editingItem.id), dataToSave);
        toast({ title: 'Succès !', description: "L'offre a été modifiée." });
      } else {
        await addDoc(collection(getDbInstance(), 'offresAffaires'), dataToSave);
        toast({ title: 'Succès !', description: "L'offre a été ajoutée." });
      }

      form.reset();
      setGalleryFiles([]);
      setMainImageFile(null);
      setEditingItem(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur :', error);
      toast({ title: 'Erreur', description: 'Une erreur est survenue.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDeleteImage(idx: number) {
    if (!editingItem?.images) return;
    const newImages = editingItem.images.filter((_, i) => i !== idx);
    setEditingItem({ ...editingItem, images: newImages });
    await updateDoc(doc(getDbInstance(), 'offresAffaires', editingItem.id), { images: newImages });
  }

  async function handleDelete(id: string, public_id: string) {
    setDeletingId(id);
    try {
      if (public_id) await deleteImageFromCloudinary(public_id);
      await deleteDoc(doc(getDbInstance(), 'offresAffaires', id));
      toast({ title: 'Supprimé', description: "L'offre a été supprimée." });
    } catch (error) {
      console.error('Erreur :', error);
      toast({ title: 'Erreur', description: 'Suppression impossible.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  }

  const typeLabels: Record<string, string> = {
    tourisme_religieux: 'Tourisme religieux', tourisme_local: 'Tourisme local', tourisme_linguistique: 'Tourisme linguistique', tourisme_affaires: "Tourisme d'affaires",
    seminaire: 'Tourisme d’affaires', incentive: 'Tourisme d’affaires', mice: 'Tourisme d’affaires', mission_sur_mesure: 'Tourisme d’affaires',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Gérer le Tourisme</h2>
          <p className="text-muted-foreground">Ajoutez et modifiez les offres par catégorie.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Modifier' : 'Nouvelle'} offre de tourisme</DialogTitle>
              <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="titre" render={({ field }) => (
                  <FormItem><FormLabel>Titre</FormLabel><FormControl><Input placeholder="Organisation de séminaires..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description courte</FormLabel><FormControl><Textarea placeholder="Nous prenons en charge..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="descriptionComplete" render={({ field }) => (
                  <FormItem><FormLabel>Description complète</FormLabel><FormControl><Textarea className="min-h-[120px]" placeholder="Description détaillée affichée sur la page..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="prix" render={({ field }) => (
                    <FormItem><FormLabel>Prix</FormLabel><FormControl><Input placeholder="Sur devis" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="tag" render={({ field }) => (
                    <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input placeholder="MICE" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="tourisme_religieux">Tourisme religieux</SelectItem>
                          <SelectItem value="tourisme_local">Tourisme local</SelectItem>
                          <SelectItem value="tourisme_linguistique">Tourisme linguistique</SelectItem>
                          <SelectItem value="tourisme_affaires">Tourisme d'affaires</SelectItem>
                        </SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="capacite" render={({ field }) => (
                    <FormItem><FormLabel>Capacité</FormLabel><FormControl><Input placeholder="20-500 personnes" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="lieu" render={({ field }) => (
                    <FormItem><FormLabel>Lieu</FormLabel><FormControl><Input placeholder="Dakar et Afrique de l'Ouest" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="duree" render={({ field }) => (
                    <FormItem><FormLabel>Durée</FormLabel><FormControl><Input placeholder="1-5 jours" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="services" render={({ field }) => (
                  <FormItem><FormLabel>Services inclus (séparés par virgules)</FormLabel><FormControl><Input placeholder="Réservation salles, Matériel technique, Restauration, Accueil" {...field} /></FormControl><FormMessage /></FormItem>
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
                  <FormItem>
                    <FormLabel>Image principale {editingItem && "(laisser vide pour garder l'actuelle)"}</FormLabel>
                    <FormControl><Input type="file" accept="image/*" {...form.register('image', {
                      onChange: (e) => setMainImageFile(e.target.files?.[0] || null)
                    })} /></FormControl>
                    <FormMessage />
                    {(mainImageFile || editingItem?.image) && (
                      <div className="mt-2">
                        <ImagePreview
                          file={mainImageFile || undefined}
                          url={!mainImageFile ? editingItem?.image : undefined}
                          alt="Apercu image principale"
                          size={120}
                        />
                      </div>
                    )}
                  </FormItem>
                )} />
                <div>
                  <FormLabel>Images galerie (optionnel)</FormLabel>
                  <Input type="file" accept="image/*" multiple className="mt-1" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setGalleryFiles((prev) => [...prev, ...files]);
                  }} />
                  {galleryFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {galleryFiles.map((file, idx) => (
                        <ImagePreview
                          key={idx}
                          file={file}
                          alt={`Nouvelle image ${idx + 1}`}
                          size={64}
                          onRemove={() => setGalleryFiles((prev) => prev.filter((_, i) => i !== idx))}
                        />
                      ))}
                    </div>
                  )}
                  {editingItem && editingItem.images && editingItem.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingItem.images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16">
                          <Image src={img} alt={`Galerie ${idx + 1}`} fill className="rounded-md object-cover" />
                          <button type="button" onClick={() => handleDeleteImage(idx)} className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {isUploading && <Progress value={uploadProgress} className="w-full" />}
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingItem ? 'Modifier' : 'Ajouter'}
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
              <TableHead>Lieu</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Image src={item.image} alt={item.titre} width={64} height={64} className="rounded-md object-cover h-16 w-16" /></TableCell>
                  <TableCell className="font-medium">{item.titre}</TableCell>
                  <TableCell>{typeLabels[item.type] || item.type}</TableCell>
                  <TableCell>{item.lieu}</TableCell>
                  <TableCell>{item.capacite}</TableCell>
                  <TableCell>{item.prix}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.public_id)} disabled={deletingId === item.id}>
                        {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} className="text-center h-24">Aucune offre trouvée.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
