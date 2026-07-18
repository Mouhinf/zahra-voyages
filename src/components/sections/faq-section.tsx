import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type FaqEntry = {
  question: string;
  reponse: string;
};

type FaqSectionProps = {
  title?: string;
  subtitle?: string;
  items: FaqEntry[];
};

export default function FaqSection({
  title = 'Questions fréquentes',
  subtitle,
  items,
}: FaqSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.reponse}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
