export interface TileTypeConfig {
  type: 'texture' | 'model';
  texture?: string;
  model?: string;
  color: string;
}

export interface TileTypesConfig {
  tileTypes: {
    [key: string]: TileTypeConfig;
  }
}

const tileTypesConfig: TileTypesConfig = {
  tileTypes: {
    grass: {
      type: "texture",
      texture: "maps/greenland/textures/grass_diffuse.jpg",
      color: "white"
    },
    path: {
      type: "texture",
      texture: "maps/greenland/textures/path_diffuse.png",
      color: "white"
    },
    tree: {
      type: "model",
      model: "maps/greenland/models/tree.glb",
      color: "white",
      texture: "maps/greenland/textures/grass_diffuse.jpg"
    },
    water: {
      type: "texture",
      texture: "maps/greenland/textures/water_diffuse.jpg",
      color: "white"
    },
    trap_path: {
      type: "texture",
      texture: "maps/greenland/textures/trap_path.png",
      color: "white"
    },
    blessing_path: {
      type: "texture",
      texture: "maps/greenland/textures/blessing_path.png",
      color: "white"
    },
    benefit_path: {
      type: "texture",
      texture: "maps/greenland/textures/benefit_path.png",
      color: "white"
    },
    surprise_path: {
      type: "texture",
      texture: "maps/greenland/textures/surprise_path.jpg",
      color: "white"
    }
  }
};

export default tileTypesConfig;