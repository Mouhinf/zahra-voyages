export type Destination = {
  id: string;
  name: string;
  price: string;
  image: string; // URL de l'image
  tag: string;
  public_id: string; // Cloudinary public_id for deletion
};