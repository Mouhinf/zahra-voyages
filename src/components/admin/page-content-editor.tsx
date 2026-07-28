'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { defaultPageContents } from '@/data/default-page-contents';
import { savePageContent } from '@/lib/page-content';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import type { FaqItem, PageContent, PageSlug } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ImagePreview } from '@/components/admin/image-preview';
import { ChevronDown, Loader2, PlusCircle, Save, Trash2 } from 'lucide-react';
import Image from 'next/image';

type PageContentEditorProps = {
  pageSlug: PageSlug;
  pageLabel: string;
  showFaq?: boolean;
};

export default function PageContentEditor({ pageSlug, pageLabel, showFaq = false }: PageContentEditorProps) {
  const { toast } = useToast();
  const [content, setContent] = useState<PageContent>(defaultPageContents[pageSlug]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(getDbInstance(), 'pageContents', pageSlug),
      (docSnap) => {
        const defaults = defaultPageContents[pageSlug];
        if (docSnap.exists()) {
          setContent({ ...defaults, ...docSnap.data(), id: pageSlug } as PageContent);
        } else {
          setContent(defaults);
        }
      },
      (error) => {
        console.error(`Erreur chargement pageContents/${pageSlug}:`, error);
        setContent(defaultPageContents[pageSlug]);
      }
    );
    return () => unsubscribe();
  }, [pageSlug]);

  function updateHero(field: keyof PageContent['hero'], value: string) {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  }

  function updateGrid(field: keyof PageContent['gridSection'], value: string) {
    setContent((prev) => ({ ...prev, gridSection: { ...prev.gridSection, [field]: value } }));
  }

  function updateCta(field: keyof PageContent['ctaSection'], value: string) {
    setContent((prev) => ({ ...prev, ctaSection: { ...prev.ctaSection, [field]: value } }));
  }

  function updateFaq(field: 'title' | 'subtitle', value: string) {
    setContent((prev) => ({
      ...prev,
      faq: { ...(prev.faq ?? { title: '', subtitle: '', items: [] }), [field]: value },
    }));
  }

  function updateFaqItem(index: number, field: keyof FaqItem, value: string) {
    setContent((prev) => {
      const items = [...(prev.faq?.items ?? [])];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, faq: { ...(prev.faq ?? { title: '', subtitle: '', items: [] }), items } };
    });
  }

  function addFaqItem() {
    setContent((prev) => ({
      ...prev,
      faq: {
        ...(prev.faq ?? { title: 'FAQ', subtitle: '', items: [] }),
        items: [...(prev.faq?.items ?? []), { question: '', reponse: '' }],
      },
    }));
  }

  function removeFaqItem(index: number) {
    setContent((prev) => ({
      ...prev,
      faq: {
        ...(prev.faq ?? { title: '', subtitle: '', items: [] }),
        items: (prev.faq?.items ?? []).filter((_, i) => i !== index),
      },
    }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      let heroImage = content.hero.image;
      let heroPublicId = content.hero.public_id ?? '';

      if (heroImageFile) {
        const uploaded = await uploadImageToCloudinary(heroImageFile);
        heroImage = uploaded.secure_url;
        heroPublicId = uploaded.public_id;
      }

      await savePageContent(pageSlug, {
        ...content,
        hero: { ...content.hero, image: heroImage, public_id: heroPublicId },
      });

      setHeroImageFile(null);
      toast({ title: 'Contenu enregistré', description: `La page ${pageLabel} a été mise à jour.` });
    } catch (error) {
      console.error('Erreur sauvegarde contenu page:', error);
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder le contenu.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-8 border rounded-lg bg-background">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        >
          <div>
            <p className="font-semibold text-primary">Contenu de la page « {pageLabel} »</p>
            <p className="text-sm text-muted-foreground">
              Modifier le bandeau, les textes et {showFaq ? 'la FAQ' : 'les sections'} affichés sur le site public.
            </p>
          </div>
          <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 space-y-6 border-t">
        <div className="pt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Titre SEO</Label>
            <Input
              value={content.metaTitle}
              onChange={(e) => setContent((prev) => ({ ...prev, metaTitle: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description SEO</Label>
            <Textarea
              value={content.metaDescription}
              onChange={(e) => setContent((prev) => ({ ...prev, metaDescription: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-primary">Bandeau principal</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input value={content.hero.badge} onChange={(e) => updateHero('badge', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Sous-titre</Label>
              <Textarea value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Image du bandeau</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroImageFile(e.target.files?.[0] ?? null)}
              />
              <div className="mt-2 flex items-start gap-4">
                {(heroImageFile || content.hero.image) && (
                  <ImagePreview
                    file={heroImageFile ?? undefined}
                    url={!heroImageFile ? content.hero.image : undefined}
                    alt="Aperçu bandeau"
                    size={160}
                  />
                )}
                {!heroImageFile && content.hero.image && (
                  <div className="relative w-40 h-24 rounded-md overflow-hidden">
                    <Image src={content.hero.image} alt="Bandeau actuel" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-primary">Section offres</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input value={content.gridSection.badge} onChange={(e) => updateGrid('badge', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input value={content.gridSection.title} onChange={(e) => updateGrid('title', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={content.gridSection.description}
                onChange={(e) => updateGrid('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-primary">Section appel à l&apos;action</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input value={content.ctaSection.title} onChange={(e) => updateCta('title', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={content.ctaSection.description}
                onChange={(e) => updateCta('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        {showFaq && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-primary">FAQ</h3>
              <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une question
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Titre FAQ</Label>
                <Input
                  value={content.faq?.title ?? ''}
                  onChange={(e) => updateFaq('title', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Sous-titre FAQ</Label>
                <Input
                  value={content.faq?.subtitle ?? ''}
                  onChange={(e) => updateFaq('subtitle', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              {(content.faq?.items ?? []).map((item, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Question {index + 1}</p>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFaqItem(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Réponse</Label>
                    <Textarea
                      value={item.reponse}
                      onChange={(e) => updateFaqItem(index, 'reponse', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer le contenu de la page
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
