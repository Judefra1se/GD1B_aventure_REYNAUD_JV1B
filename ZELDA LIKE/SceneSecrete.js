export class SceneSecrete extends Phaser.Scene {
    constructor() {
        super("SceneSecrete");
    }

    init(data) {
        this.scoreFleur = data.scoreFleur;
        this.scoreSushi = data.scoreSushi;
        this.scorePansement = data.scorePansement;
        this.scoreFleurText = data.scoreFleurText;
        this.scoreSushiText = data.scoreSushiText;
        this.scorePansementText = data.scoreSushiText;
        this.hasPchit = data.hasPchit;
    }
    preload(){
    //Ajout de la carte Tiled.
    const carteSombre = this.add.tilemap("secrete");
    const tileset = carteSecrete.addTilesetImage(
        "Assets",
        "Phaser_assets"
    );
    const Sols = carteSecrete.createLayer(
        "Sols",
        tileset
    );
    const Decor = carteSecrete.createLayer(
        "Decor",
        tileset
    );
    const Porte = carteSecrete.createLayer(
        "Porte",
        tileset
    );
    const Porte2 = carteSecrete.createLayer(
        "Porte2",
        tileset
    );

            //Ajout des collisions avec les objets.
            Decor.setCollisionByProperty({ estSolide: true });
            Porte.setCollisionByExclusion(-1, true);
}
}