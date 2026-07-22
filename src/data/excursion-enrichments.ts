export type ExcursionEnrichment = {
  image: string;
  images: string[];
};

export const excursionEnrichments: Record<string, ExcursionEnrichment> = {
  Hp0ddKhZXw3SWW6XPTM9: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Beach_impression_Saly.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/4/46/Beach_impression_Saly.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/18/Nature_mer_climat_a_saly_au_senegal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9e/Saly_Senegal5.JPG',
    ],
  },
  UHrzMegsiJbGDqVgHu9I: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Lac_rose_au_S%C3%A9n%C3%A9gal.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/9/9e/Lac_rose_au_S%C3%A9n%C3%A9gal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e1/Lac_Rose_in_Senegal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bd/Lac_rose_S%C3%A9n%C3%A9gal.jpg',
    ],
  },
  ehptbY3gUtuk8HdqSUz8: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Rice_paddy%2C_Casamance%2C_Senegal.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/4/47/Rice_paddy%2C_Casamance%2C_Senegal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/56/Alyssa_K._Barry_Enampore%2C_Casamance%2C_Senegal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/8c/Casamance_landscape.jpg',
    ],
  },
  p1Wlkpg9jNerzAjUlx6B: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Gor%C3%A9e_2024_-_coucher_de_soleil_sur_Dakar_-_25.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/4/45/Gor%C3%A9e_2024_-_coucher_de_soleil_sur_Dakar_-_25.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/2f/C%C3%B4tes_de_l%27%C3%AEle_de_Gor%C3%A9e_au_S%C3%A9n%C3%A9gal_05.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9a/%C3%8Ele_de_Gor%C3%A9e_vue_de_la_chaloupe_15.jpg',
    ],
  },
  qHZzbK8HxEV0sbIf7JLS: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Giraffe_in_Bandia_reserve_near_Dakar_Senegal.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/7/78/Giraffe_in_Bandia_reserve_near_Dakar_Senegal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/93/BaobabElephantBandia.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/a/af/Paysage_reserve_de_bandia.jpg',
    ],
  },
  uJ0WtGYl895ZtVPsKn2j: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Delta_du_Sine_Saloum_-_Patrimoine_Mondial_de_L%27Unesco_04.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/9/9a/Delta_du_Sine_Saloum_-_Patrimoine_Mondial_de_L%27Unesco_04.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/8a/Delta_du_Sine_Saloum_-_Patrimoine_Mondial_de_L%27Unesco_05.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/14/Delta_du_Sine_Saloum_-_Patrimoine_Mondial_de_L%27Unesco_17.jpg',
    ],
  },
};

export function getExcursionEnrichment(id: string) {
  return excursionEnrichments[id];
}
