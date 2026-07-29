'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDbInstance } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Excursion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/cloudinary';
import { featuredExcursions } from '@/data/featured-excursions';
import { hideOrDeleteCatalogItem, mergeWithFeatured, patchCatalogItem, saveCatalogItem } from '@/lib/catalog-admin';
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
import PageContentEditor from '@/components/admin/page-content-editor';

const featuredExcursionIds = new Set(featuredExcursions.map((item) => item.id));

// Schéma pour les deux types : excursion et circuit
const formSchema = z.object({
  titre: z.string().min(2, 'Le titre doit contenir au moins 2 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  descriptionComplete: z.string().optional(),
  prix: z.string().min(3, 'Veuillez entrer un prix.'),
  tag: z.string().min(2, 'Veuillez entrer une catégorie.'),
  type: z.enum(['excursion', 'circuit']),
  lieu: z.string().min(2, 'Veuillez entrer un lieu.'),
  duree: z.string().min(2, 'Veuillez entrer une durée.'),
  pointDepart: z.string().min(2, 'Veuillez entrer un point de départ.'),
  difficulte: z.enum(['facile', 'moyenne', 'sportive']),
  inclus: z.string(),
  disponible: z.boolean().default(true),
  ordre: z.coerce.number().default(0),
  image: z.custom<FileList>((value) => typeof FileList !== 'undefined' && value instanceof FileList).optional(),
});

// Visibilité des champs selon le type
function getFieldsVisibility(type: string) {
  const base = {
    titre: true,
    description: true,
    descriptionComplete: type === 'circuit',
    prix: true,
    tag: true,
    type: true,
    lieu: true,
    duree: true,
    pointDepart: true,
    difficulte: type === 'excursion',
    inclus: true,
    disponible: true,
    ordre: true,
    image: true,
  };
  return base;
}

const labelByField: Record<string, string> = {
  titre: 'Titre',
  description: 'Description courte',
  descriptionComplete: 'Description complète',
  prix: 'Prix',
  tag: 'Catégorie',
  type: 'Type',
  lieu: 'Lieu',
  duree: 'Durée',
  pointDepart: 'Point de départ',
  difficulte: 'Difficulté',
  inclus: 'Inclus (séparés par virgules)',
  disponible: 'Disponible',
  ordre: "Ordre d'affichage",
};

const placeholderByField: Record<string, string> = {
  titre: 'Excursion ou circuit touristique',
  description: 'Description courte de l\'activité...',
  descriptionComplete: 'Description détaillée pour la page complète...',
  prix: 'Dès 15 000 FCFA/personne',
  tag: 'Culture, Nature, Aventure...',
  lieu: 'Sénégal, Dakar...',
  duree: 'Demi-journée (4h)',
  pointDepart: 'Dakar',
  inclus: 'Transport, Guide, Repas',
  ordre: '0',
};

type FormValues = z.infer<typeof formSchema>;

export default function ExcursionsCircuitsManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Excursion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Excursion | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'excursion' | 'circuit'>('excursion');
  const [persistedIds, setPersistedIds] = useState<Set<string>>(new Set());

  const [fieldVisibility, setFieldVisibility] = useState(getFieldsVisibility('excursion'));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: '', description: '', descriptionComplete: '', prix: '', tag: '',
      type: 'excursion', lieu: '', duree: '', pointDepart: '',
      difficulte: 'facile', inclus: '', disponible: true, ordre: 0,
    },
  });

  useEffect(() => {
    const q = query(collection(getDbInstance(), 'excursions'), orderBy('ordre', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const firestoreItems = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Excursion));
      setPersistedIds(new Set(firestoreItems.map((item) => item.id)));
      setItems(mergeWithFeatured(firestoreItems, featuredExcursions));
      setIsLoading(false);
    }, (error) => {
      console.error('Erreur chargement excursions admin:', error);
      setPersistedIds(new Set());
      setItems(featuredExcursions);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter((item) => item.type === activeTab && item.disponible !== false);

  function openAddDialog() {
    setEditingItem(null);
    setGalleryFiles([]);
    setMainImageFile(null);
    form.reset({
      titre: '', description: '', descriptionComplete: '', prix: '', tag: '',
      type: activeTab, lieu: '', duree: '', pointDepart: '',
      difficulte: 'facile', inclus: '', disponible: true, ordre: 0,
    });
    setFieldVisibility(getFieldsVisibility(activeTab));
    setIsDialogOpen(true);
  }

  function openEditDialog(item: Excursion) {
    setEditingItem(item);
    setGalleryFiles([]);
    setMainImageFile(null);
    form.reset({
      titre: item.titre,
      description: item.description,
      descriptionComplete: item.descriptionComplete || '',
      prix: item.prix,
      tag: item.tag,
      type: item.type,
      lieu: item.lieu,
      duree: item.duree,
      pointDepart: item.pointDepart,
      difficulte: item.difficulte || 'facile',
      inclus: (item.inclus || []).join(', '),
      disponible: item.disponible,
      ordre: item.ordre,
    });
    setFieldVisibility(getFieldsVisibility(item.type));
    setIsDialogOpen(true);
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'type') {
        setFieldVisibility(getFieldsVisibility(value.type || 'excursion'));
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

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
        lieu: values.lieu,
        duree: values.duree,
        pointDepart: values.pointDepart,
        difficulte: values.difficulte,
        inclus: values.inclus.split(',').map((s) => s.trim()).filter(Boolean),
        disponible: values.disponible,
        ordre: values.ordre,
        image: imageUrl,
        public_id: publicId,
        images: galleryImages,
      };

      await saveCatalogItem(
        getDbInstance(),
        'excursions',
        dataToSave,
        editingItem?.id ?? null,
        featuredExcursionIds,
        persistedIds
      );
      toast({
        title: 'Succès !',
        description: editingItem ? "L'élément a été modifié." : "L'élément a été ajouté.",
      });

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
    await patchCatalogItem(
      getDbInstance(),
      'excursions',
      editingItem.id,
      { images: newImages },
      featuredExcursionIds,
      persistedIds
    );
  }

  async function handleDelete(id: string, public_id: string) {
    setDeletingId(id);
    try {
      const result = await hideOrDeleteCatalogItem(
        getDbInstance(),
        'excursions',
        id,
        featuredExcursionIds,
        persistedIds
      );
      if (result === 'deleted' && public_id) await deleteImageFromCloudinary(public_id);
      toast({
        title: 'Supprimé',
        description: result === 'hidden'
          ? "L'élément ne sera plus visible sur le site."
          : "L'élément a été supprimé.",
      });
    } catch (error) {
      console.error('Erreur :', error);
      toast({ title: 'Erreur', description: 'Suppression impossible.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <PageContentEditor pageSlug="excursions" pageLabel="Circuits et Excursions" />
      {/* Sous-onglets Excursions / Circuits */}
      <div className="flex gap-2 mb-4">
        <div className="flex border rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab('excursion')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'excursion'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            Excursions
          </button>
          <button
            onClick={() => setActiveTab('circuit')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'circuit'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            Circuits
          </button>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {activeTab === 'excursion' ? 'Excursions' : 'Circuits'} : {filteredItems.length} élément(s)
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">
            Gérer les {activeTab === 'excursion' ? 'Excursions' : 'Circuits'}
          </h2>
          <p className="text-muted-foreground">
            Ajoutez et modifiez les {activeTab === 'excursion' ? 'excursions' : 'circuits'}.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Modifier' : 'Nouveau'} - {activeTab === 'excursion' ? 'Excursion' : 'Circuit'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous.
                <span className="text-xs text-muted-foreground block mt-1">
                  Les champs s'adaptent automatiquement selon le type sélectionné.
                </span>
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="titre" render={({ field }) => (
                  <FormItem><FormLabel>{labelByField.titre}</FormLabel><FormControl><Input placeholder={placeholderByField.titre} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="excursion">Excursion</SelectItem>
                        <SelectItem value="circuit">Circuit</SelectItem>
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="prix" render={({ field }) => (
                    <FormItem><FormLabel>{labelByField.prix}</FormLabel><FormControl><Input placeholder={placeholderByField.prix} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="tag" render={({ field }) => (
                    <FormItem><FormLabel>{labelByField.tag}</FormLabel><FormControl><Input placeholder="Culture, Nature, Aventure..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>{labelByField.description}</FormLabel><FormControl><Textarea placeholder={placeholderByField.description} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                {fieldVisibility.descriptionComplete && (
                  <FormField control={form.control} name="descriptionComplete" render={({ field }) => (
                    <FormItem><FormLabel>{labelByField.descriptionComplete}</FormLabel><FormControl><Textarea className="min-h-[120px]" placeholder={placeholderByField.descriptionComplete} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="lieu" render={({ field }) => (
                    <FormItem><FormLabel>{labelByField.lieu}</FormLabel><FormControl><Input placeholder={placeholderByField.lieu} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="duree" render={({ field }) => (
                    <FormItem><FormLabel>{labelByField.duree}</FormLabel><FormControl><Input placeholder={placeholderByField.duree} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="pointDepart" render={({ field }) => (
                    <FormItem><FormLabel>{labelByField.pointDepart}</FormLabel><FormControl><Input placeholder={placeholderByField.pointDepart} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  {fieldVisibility.difficulte && (
                    <FormField control={form.control} name="difficulte" render={({ field }) => (
                      <FormItem><FormLabel>{labelByField.difficulte}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Difficulté" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="facile">Facile</SelectItem>
                            <SelectItem value="moyenne">Moyenne</SelectItem>
                            <SelectItem value="sportive">Sportive</SelectItem>
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>

                <FormField control={form.control} name="inclus" render={({ field }) => (
                  <FormItem><FormLabel>{labelByField.inclus}</FormLabel><FormControl><Input placeholder={placeholderByField.inclus} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="ordre" render={({ field }) => (
                    <FormItem><FormLabel>{labelByField.ordre}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="disponible" render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3 pt-6">
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="!mt-0">{labelByField.disponible}</FormLabel>
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
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Image src={item.image} alt={item.titre} width={64} height={64} className="rounded-md object-cover h-16 w-16" /></TableCell>
                  <TableCell className="font-medium">{item.titre}</TableCell>
                  <TableCell>{item.type === 'circuit' ? 'Circuit' : 'Excursion'}</TableCell>
                  <TableCell>{item.lieu}</TableCell>
                  <TableCell>{item.duree}</TableCell>
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
              <TableRow><TableCell colSpan={7} className="text-center h-24">Aucun élément trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
