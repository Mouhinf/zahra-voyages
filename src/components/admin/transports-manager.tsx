'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDbInstance } from '@/lib/firebase';
import { collection, addDoc, updateDoc, onSnapshot, query, orderBy, doc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { Transport } from '@/types';
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
import { PlusCircle, Loader2, Trash2, Pencil, X, Car } from 'lucide-react';
import { ImagePreview } from '@/components/admin/image-preview';

const formSchema = z.object({
  titre: z.string().min(2, 'Le titre doit contenir au moins 2 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  descriptionComplete: z.string().optional(),
  prix: z.string().min(3, 'Veuillez entrer un prix.'),
  tag: z.string().min(2, 'Veuillez entrer une catégorie.'),
  type: z.enum(['billet_avion', 'transfert_aeroport', 'transfert_plage', 'location_voiture']),
  vehicule: z.string().optional(),
  capacitePassagers: z.coerce.number().min(1).max(500).optional(),
  avecChauffeur: z.boolean().default(false),
  carburantInclus: z.boolean().default(false),
  disponible: z.boolean().default(true),
  ordre: z.coerce.number().default(0),
  image: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORY_LABELS: Record<string, string> = {
  billet_avion: 'Billet d\'avion',
  transfert_aeroport: 'Transfert aéroport',
  transfert_plage: 'Transfert par la plage',
  location_voiture: 'Location voiture (avec chauffeur)',
};

export default function TransportsManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transport | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: '', description: '', descriptionComplete: '', prix: '', tag: '', type: 'billet_avion',
      vehicule: '', capacitePassagers: 4, avecChauffeur: false, carburantInclus: false,
      disponible: true, ordre: 0,
    },
  });

  const watchedType = form.watch('type');

  useEffect(() => {
    const q = query(collection(getDbInstance(), 'transports'), orderBy('ordre', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data: Transport[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Transport));
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
      titre: '', description: '', descriptionComplete: '', prix: '', tag: '', type: 'billet_avion',
      vehicule: '', capacitePassagers: 4, avecChauffeur: false, carburantInclus: false,
      disponible: true, ordre: 0,
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(item: Transport) {
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
      vehicule: item.vehicule || '',
      capacitePassagers: item.capacitePassagers || 4,
      avecChauffeur: item.avecChauffeur || false,
      carburantInclus: item.carburantInclus || false,
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

      // Champs communs à toutes les catégories
      const dataToSave: Record<string, unknown> = {
        titre: values.titre,
        description: values.description,
        descriptionComplete: values.descriptionComplete || '',
        prix: values.prix,
        tag: values.tag,
        type: values.type,
        disponible: values.disponible,
        ordre: values.ordre,
        image: imageUrl,
        public_id: publicId,
        images: galleryImages,
      };

      // Champs spécifiques aux catégories véhicule (transfert_aeroport, transfert_plage, location_voiture)
      if (values.type !== 'billet_avion') {
        dataToSave.vehicule = values.vehicule || '';
        dataToSave.capacitePassagers = values.capacitePassagers || 4;
      }

      // Champs spécifiques à location_voiture
      if (values.type === 'location_voiture') {
        dataToSave.avecChauffeur = values.avecChauffeur;
        dataToSave.carburantInclus = values.carburantInclus;
      }

      if (editingItem) {
        await updateDoc(doc(getDbInstance(), 'transports', editingItem.id), dataToSave);
        toast({ title: 'Succès !', description: 'Le transport a été modifié.' });
      } else {
        await addDoc(collection(getDbInstance(), 'transports'), dataToSave);
        toast({ title: 'Succès !', description: 'Le transport a été ajouté.' });
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
    await updateDoc(doc(getDbInstance(), 'transports', editingItem.id), { images: newImages });
  }

  async function handleDelete(id: string, public_id: string) {
    setDeletingId(id);
    try {
      if (public_id) await deleteImageFromCloudinary(public_id);
      await deleteDoc(doc(getDbInstance(), 'transports', id));
      toast({ title: 'Supprimé', description: 'Le transport a été supprimé.' });
    } catch (error) {
      console.error('Erreur :', error);
      toast({ title: 'Erreur', description: 'Suppression impossible.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  }

  async function seedVehicules() {
    const db = getDbInstance();
    const seedData = [
      {
        titre: 'Berline',
        description: 'Véhicule élégant et confortable, idéal pour vos déplacements professionnels et urbains. Climatisation, sièges cuir, espace généreux.',
        descriptionComplete: 'Nos berlines sont des véhicules haut de gamme parfaitement adaptés aux déplacements professionnels et aux transferts VIP. Chaque berline est équipée de la climatisation, de sièges en cuir ajustables, d\'un système audio haute fidélité et d\'une connexion Wi-Fi embarquée. Nos chauffeurs professionnels, formés à l\'excellence du service, assurent une conduite souple et sécurisée. Le coffre spacieux peut accueillir jusqu\'à 3 valises, idéal pour les transferts aéroportuaires. Nos berlines sont régulièrement entretenues et nettoyées après chaque course pour garantir une expérience irréprochable. Que ce soit pour un rendez-vous d\'affaires, un mariage ou un transfert VIP, la berline SLAAC vous offre le confort et l\'élégance que vous méritez.',
        image: '/mercedese.avif',
        images: ['/mercedese.avif', '/bmw1.webp', '/voitaff.jpeg'],
        tag: 'Berline',
        type: 'location_voiture',
        ordre: 1, disponible: true, vehicule: 'berline', capacitePassagers: 4, avecChauffeur: true, carburantInclus: true,
      },
      {
        titre: 'Minibus',
        description: 'Minibus spacieux et climatisé pour vos voyages en groupe. Confort optimal pour les trajets interurbains et les excursions familiales.',
        descriptionComplete: 'Nos minibus sont la solution idéale pour les déplacements en groupe, alliant espace et confort. Chaque minibus peut accueillir jusqu\'à 14 passagers dans des sièges baquets inclinables avec accoudoirs individuels. Le véhicule est équipé de la climatisation puissante, d\'un système multimédia avec écrans, de ports USB pour chaque passager et d\'un grand coffre pouvant contenir les bagages de tous les voyageurs. Nos chauffeurs expérimentés connaissent parfaitement les routes du Sénégal et assurent des trajets en toute sécurité. Le minibus SLAAC est parfait pour les excursions en famille, les sorties en groupe, les transferts de mariage et les navettes vers les sites touristiques. Chaque véhicule est désinfecté et préparé avec soin avant chaque départ.',
        image: '/toyotahiace.webp',
        images: ['/toyotahiace.webp'],
        tag: 'Minibus',
        type: 'location_voiture',
        ordre: 2, disponible: true, vehicule: 'minibus', capacitePassagers: 14, avecChauffeur: true, carburantInclus: true,
      },
      {
        titre: 'Bus',
        description: 'Bus grand confort pour le transport de groupes nombreux. Climatisation, sièges inclinables et coffre à bagages spacieux.',
        descriptionComplete: 'Nos bus grand tourisme offrent une capacité de 20 à 40 passagers avec tout le confort nécessaire pour les longs trajets. Chaque bus est équipé de sièges inclinables en velours avec repose-pieds, climatisation individuelle, écrans de divertissement, toilettes embarquées et un système audio professionnel. Le coffre à bagages spacieux peut accueillir les valises de tous les passagers ainsi que du matériel supplémentaire. Nos bus sont parfaits pour les séminaires d\'entreprise, les excursions touristiques, les pèlerinages, les mariages et les événements sportifs. Chaque conducteur possède les permis nécessaires et une expérience confirmée dans le transport de groupes. Nous proposons également un service de restauration légère à bord pour les trajets de plus de 3 heures. La sécurité et le confort de vos passagers sont notre priorité absolue.',
        image: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/bus-autocar',
        images: ['https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/bus-autocar'],
        tag: 'Bus',
        type: 'location_voiture',
        ordre: 3, disponible: true, vehicule: 'bus', capacitePassagers: 40, avecChauffeur: true, carburantInclus: true,
      },
      {
        titre: '4x4',
        description: "Véhicule tout-terrain robuste et puissant pour l'aventure sénégalaise. Parfait pour explorer les régions les plus reculées en toute sécurité.",
        descriptionComplete: 'Nos véhicules 4x4 sont spécialement sélectionnés pour affronter les terrains les plus exigeants du Sénégal. Que ce soit pour explorer la Casamance, traverser le désert du Sahel, atteindre le Lac Rose ou partir en safari dans la réserve de Bandia, nos 4x4 vous emmènent partout en toute sécurité. Chaque véhicule est équipé de pneus tout-terrain, d\'une suspension renforcée, de la climatisation puissante et d\'un système de navigation GPS. Nos chauffeurs-guides connaissent parfaitement les pistes et les sites naturels du Sénégal et vous feront découvrir des endroits inaccessibles aux véhicules classiques. Le 4x4 SLAAC est également idéal pour les photographes et les aventuriers souhaitant explorer les coins les plus reculés du pays. Tout l\'équipement nécessaire est inclus : glacière, trousse de premiers secours et matériel de sécurité.',
        image: '/fortuner.png',
        images: ['/fortuner.png', '/toyotalang.webp'],
        tag: '4x4',
        type: 'location_voiture',
        ordre: 4, disponible: true, vehicule: '4x4', capacitePassagers: 6, avecChauffeur: true, carburantInclus: true,
      },
      {
        titre: 'SUV',
        description: "SUV moderne et polyvalent alliant confort et prestance. Véhicule premium pour des déplacements en tous genres avec une touche d'élégance.",
        descriptionComplete: 'Nos SUV allient le confort d\'une berline de luxe à la polyvalence d\'un véhicule tout chemin. Parfaits pour les circuits touristiques, les transferts VIP et les escapades en famille, les SUV SLAAC offrent une expérience de conduite exceptionnelle. Chaque véhicule est équipé de la climatisation automatique, de sièges en cuir chauffants, d\'un toit ouvrant panoramique, d\'un système de navigation dernière génération et d\'une connectivité Bluetooth. Le grand coffre permet de transporter facilement les bagages de toute la famille. Nos SUV sont particulièrement appréciés pour les visites de Dakar et de la presqu\'île du Cap-Vert, alliant prestige et confort. Que ce soit pour un circuit touristique, un transfert VIP ou une escapade le week-end, le SUV SLAAC vous garantit un voyage mémorable dans un cadre élégant et raffiné.',
        image: '/toyotarav4.webp',
        images: ['/toyotarav4.webp', '/TUCSON.avif', '/tucocc.avif'],
        tag: 'SUV',
        type: 'location_voiture',
        ordre: 5, disponible: true, vehicule: 'suv', capacitePassagers: 5, avecChauffeur: true, carburantInclus: true,
      },
    ];
    try {
      const existing = await getDocs(query(collection(db, 'transports'), where('type', '==', 'location_voiture')));
      for (const d of existing.docs) {
        await deleteDoc(doc(db, 'transports', d.id));
      }
      for (const v of seedData) {
        await addDoc(collection(db, 'transports'), v);
      }
      toast({ title: 'Succès !', description: '5 véhicules ajoutés à la catégorie Location de voiture.' });
    } catch (e) {
      toast({ title: 'Erreur', description: e instanceof Error ? e.message : "Échec de l'ajout", variant: 'destructive' });
    }
  }

  const showVehicleFields = watchedType !== 'billet_avion';
  const showLocationFields = watchedType === 'location_voiture';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Gérer les Transports</h2>
          <p className="text-muted-foreground">Ajoutez et modifiez les offres de transport par catégorie.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={seedVehicules}>
            <Car className="mr-2 h-4 w-4" /> Ajouter les 5 véhicules
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" /> Ajouter un transport</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Modifier' : 'Nouvel'} Transport</DialogTitle>
              <DialogDescription>Le formulaire s'adapte à la catégorie sélectionnée.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Type — en premier pour conditionner les champs */}
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie de transport</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="billet_avion">Billet d'avion</SelectItem>
                        <SelectItem value="transfert_aeroport">Transfert aéroport</SelectItem>
                        <SelectItem value="transfert_plage">Transfert par la plage</SelectItem>
                        <SelectItem value="location_voiture">Location voiture (avec chauffeur)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Badge indiquant la catégorie active */}
                <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-2.5 text-sm text-primary font-medium">
                  Catégorie active : {CATEGORY_LABELS[watchedType]}
                </div>

                {/* Champs communs */}
                <FormField control={form.control} name="titre" render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchedType === 'billet_avion' ? 'Titre du vol / compagnie' : 'Titre'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={watchedType === 'billet_avion' ? 'Vol Dakar-Paris Air France' : 'Transfert aéroport Dakar'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description courte</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={watchedType === 'billet_avion'
                          ? 'Vol direct vers Paris, classe économique...'
                          : 'Service de transfert confortable et ponctuel...'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="descriptionComplete" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description complète</FormLabel>
                    <FormControl><Textarea className="min-h-[120px]" placeholder="Description détaillée affichée sur la page du transport..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="prix" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={watchedType === 'billet_avion' ? 'Dès 300 000 FCFA' : 'Dès 15 000 FCFA'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="tag" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie / Étiquette</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={watchedType === 'billet_avion' ? 'Classe économique' : 'Confort'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Champs spécifiques aux véhicules (transferts + location) */}
                {showVehicleFields && (
                  <div className="space-y-4 border-t pt-4">
                    <p className="text-sm font-semibold text-primary">Informations véhicule</p>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="vehicule" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Véhicule / Modèle</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={watchedType === 'location_voiture' ? 'Toyota Corolla, 4x4...' : 'Berline, Van, Minibus...'}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="capacitePassagers" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité passagers</FormLabel>
                          <FormControl><Input type="number" min={1} max={500} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}

                {/* Champs spécifiques à la location de voiture */}
                {showLocationFields && (
                  <div className="space-y-4 border-t pt-4">
                    <p className="text-sm font-semibold text-primary">Options location</p>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="avecChauffeur" render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 pt-2">
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">Avec chauffeur</FormLabel>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="carburantInclus" render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 pt-2">
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="!mt-0">Carburant inclus</FormLabel>
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}

                {/* Ordre + disponibilité */}
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

                {/* Image principale */}
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

                {/* Galerie */}
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
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Image src={item.image} alt={item.titre} width={64} height={64} className="rounded-md object-cover h-16 w-16" /></TableCell>
                  <TableCell className="font-medium">{item.titre}</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {CATEGORY_LABELS[item.type] || item.type}
                    </span>
                  </TableCell>
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
              <TableRow><TableCell colSpan={5} className="text-center h-24">Aucun transport trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
