'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Assurez-vous que Button est importé ici
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const vehicles = [
  // Vehicles for rent
  {
    id: 1,
    type: 'economique',
    name: 'Toyota Yaris',
    description: 'Idéale pour les déplacements en ville, économique et fiable.',
    priceRent: '25 000 FCFA/jour',
    priceSale: undefined, // Use undefined for properties not applicable
    image: '/toyotayaris.webp', // Remplacez par l'image réelle
  },
  {
    id: 2,
    type: 'suv',
    name: 'Toyota RAV4',
    description: 'Confortable et spacieux pour les familles et les longs trajets.',
    priceRent: '40 000 FCFA/jour',
    priceSale: undefined,
    image: '/toyotarav4.webp', // Remplacez par l'image réelle
  },
  {
    id: 3,
    type: 'minibus',
    name: 'Toyota Hiace',
    description: 'Parfait pour les voyages en groupe ou les transferts aéroport.',
    priceRent: '60 000 FCFA/jour',
    priceSale: undefined,
    image: '/toyotahiace.webp', // Remplacez par l'image réelle
  },
  {
    id: 4,
    type: 'luxe',
    name: 'Mercedes Classe E',
    description: 'Voyagez avec élégance et confort supérieur.',
    priceRent: '150 000 FCFA/jour',
    priceSale: undefined,
    image: '/mercedese.avif', // Remplacez par l'image réelle
  },
  {
    id: 5,
    type: '4x4',
    name: 'Toyota Land Cruiser Prado',
    description: 'Prêt pour l\'aventure, même sur les terrains les plus difficiles.',
    priceRent: '80 000 FCFA/jour',
    priceSale: undefined,
    image: '/toyotalang.webp', // Remplacez par l'image réelle
  },
  // Vehicles for sale
  // Vehicles for sale
  {
    id: 6,
 type: 'economique',
 name: 'Hyundai i10',
 description: 'Compacte et agile, idéale pour la ville. Modèle neuf importé.',
 priceRent: undefined,
 priceSale: '8 500 000 FCFA', // Prix ajusté (exemple)
 image: '/hundaii10.avif', // Placeholder
  },
  {
    id: 7,
 type: 'suv',
 name: 'Hyundai Tucson',
 description: 'SUV familial fiable et bien entretenu. Occasion importée.',
 priceRent: undefined,
 priceSale: '15 000 000 FCFA', // Prix ajusté (exemple)
 image: '/TUCSON.avif', // Placeholder
  },
  {
    id: 8,
 type: 'luxe',
 name: 'BMW Serie 3',
 description: 'Élégance et performance. Véhicule de luxe importé.',
    priceRent: undefined,
 priceSale: '35 000 000 FCFA', // Prix ajusté (exemple)
    image: '/bmw1.webp', // Placeholder (ajoutez une image de BMW)
  },
  {
    id: 7,
    type: 'suv',
    name: 'Hyundai Tucson (Occasion)',
    description: 'SUV familial fiable et bien entretenu. Occasion importée.',
    priceRent: undefined,
    priceSale: '15 000 000 FCFA',
    image: '/tucocc.avif', // Placeholder
  },
  {
    id: 9,
 type: '4x4',
 name: 'Toyota Fortuner',
 description: 'Robuste et polyvalent pour l\'aventure et la route. Modèle importé.',
 priceRent: undefined,
 priceSale: '22 000 000 FCFA', // Prix ajusté (exemple)
    image: '/fortuner.png', // Placeholder (ajoutez une image de Fortuner)
  },
  // Add more vehicles for sale here...
  // { id: 8, type: '...', name: '...', description: '...', priceRent: undefined, priceSale: '...', image: '...' },
];

export default function VehiclesPage() {
  const [activeSection, setActiveSection] = useState<'rent' | 'sale'>('rent'); // 'rent' or 'sale'
  const [isRentalDialogOpen, setIsRentalDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null);

  const rentalVehicles = vehicles.filter(vehicle => vehicle.priceRent !== undefined);
  const saleVehicles = vehicles.filter(vehicle => vehicle.priceSale !== undefined);

  const handleRentButtonClick = (vehicle: typeof vehicles[0]) => {
    setSelectedVehicle(vehicle);
    setIsRentalDialogOpen(true);
  };

  const handleSaleButtonClick = (vehicle: typeof vehicles[0]) => {
    setSelectedVehicle(vehicle);
    setIsSaleDialogOpen(true);
  };

  const renderVehicleCards = (vehicleList: typeof vehicles) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {vehicleList.map((vehicle) => (
        <Card key={vehicle.id} className="overflow-hidden shadow-lg flex flex-col">
          <div className="relative w-full h-48">
            <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{vehicle.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground mb-2">{vehicle.description}</p>
            <p className="text-lg font-bold text-primary">{vehicle.priceRent || vehicle.priceSale}</p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() =>
                vehicle.priceRent ? handleRentButtonClick(vehicle) : handleSaleButtonClick(vehicle)
              }
            >
              {vehicle.priceRent ? 'Réserver maintenant' : 'Acheter'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header /> {/* Le header est maintenant ici */}
        {/* Introduction Banner Section */}
        <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(/placeholder-car-banner.jpg)' }}>
          {/* Replace with your actual banner image */}{/* Overlay removed */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto max-w-7xl px-4 flex items-center justify-center h-full">
            <div className="text-center text-white z-10">
              <h1 className="text-4xl md:text-5xl font-bold">Voyagez en toute liberté grâce à nos services de ventes et locations de véhicules.</h1>
              <p className="mt-4 text-lg">Trouvez le véhicule parfait pour votre aventure en Afrique de l'Ouest.</p>
            </div>
          </div>
        </section>

        <main className="flex-grow">
        {/* Introduction Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Des Véhicules de Qualité pour Tous Vos Besoins</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Chez Zahra Voyages, nous vous offrons une sélection exceptionnelle de véhicules à la location et à la vente. Que ce soit pour un voyage d'affaires, des vacances en famille ou l'acquisition d'un véhicule importé de l'étranger, nous avons la solution.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Notre engagement : vous fournir des véhicules fiables, bien entretenus et adaptés à vos attentes, avec un service client irréproquable du début à la fin.
                </p>
              </div>
              <div className="relative h-80 lg:h-full min-h-[300px] w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/voitaff.jpeg" // Replace with an image of a nice car
                  alt="Belle voiture"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Boutons de Sélection */}
        <section className="py-8 bg-secondary/50 text-center">
          <Button className="mr-4" onClick={() => setActiveSection('rent')}>Locations de voitures</Button>
          <Button onClick={() => setActiveSection('sale')}>Ventes de voitures</Button>
        </section>

        {/* Sections Véhicules */}
        {activeSection === 'rent' && (
          <section className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto max-w-7xl px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">Location de Véhicules</h2>
              <p className="mt-4 text-lg text-muted-foreground text-center mb-12">Parcourez notre sélection de véhicules disponibles à la location pour une liberté totale lors de vos déplacements.</p>
               {renderVehicleCards(rentalVehicles)} {/* Appel unique ici */}
            </div>
          </section>
        )}


        {/* Sales Vehicles Section (You'll need to add vehicles with priceSale) */}
        {activeSection === 'sale' && (
            <section className="py-16 sm:py-24 bg-background">
              <div className="container mx-auto max-w-7xl px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">Acheter Votre Véhicule avec Zahra Voyages</h2>
                <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
                  À la recherche de votre prochaine voiture ? Explorez notre sélection de véhicules à vendre, incluant des modèles de qualité **directement importés de l'étranger**. Nous vous offrons un accompagnement complet pour un achat en toute confiance. Trouvez le véhicule qui correspond parfaitement à vos attentes et à votre budget.
                </p>
                {/* Currently, there are no vehicles with priceSale in the provided data. */}
                {saleVehicles.length > 0 ? (
                  renderVehicleCards(saleVehicles)
                ) : (
                  <p className="text-center text-muted-foreground mt-8">Aucun véhicule n'est actuellement disponible à la vente. Veuillez revenir plus tard ou nous contacter.</p>
                )}
              </div>
            </section>
        )}
      </main>

      {/* Rental Dialog */}
      <Dialog open={isRentalDialogOpen} onOpenChange={setIsRentalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver "{selectedVehicle?.name}"</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom complet
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input id="phone" type="tel" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rentalDates" className="text-right">
                Dates de location
              </Label>
              <Input id="rentalDates" className="col-span-3" placeholder="ex: 01/01/2024 - 05/01/2024" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Envoyer la demande de réservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sale Dialog */}
      <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acheter "{selectedVehicle?.name}"</DialogTitle>
          </DialogHeader>
           <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom complet
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input id="phone" type="tel" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Envoyer la demande d'achat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
