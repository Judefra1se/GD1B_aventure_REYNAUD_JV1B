export class SceneJardin extends Phaser.Scene {
    constructor() {
        super("SceneJardin");
        this.pansementSpawn = [true, true]
    }
    //Initialisation de la data pour sauvegarder les paramètres des scènes.
    init(data) {
        this.scoreFleur = data.scoreFleur;
        this.scoreSushi = data.scoreSushi;
        this.scorePansement = data.scorePansement;
        this.scoreFleurText = data.scoreFleurText;
        this.scoreSushiText = data.scoreSushiText;
        this.scorePansementText = data.scoreSushiText;
        this.hasPchit = data.hasPchit;
    }
    //FONCTION PRELOAD
    preload() {
        this.load.image("Phaser_assets", "Assets.png");
        this.load.tilemapTiledJSON("jardin", "jardin.json");
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.image("fleur", "fleur.png");
        this.load.image("sushi", "sushi.png");
    }

    //FONCTION CREATE
    create() {
        //Variables.
        this.gameOver = false
        this.suivre = false
        this.suivre2 = false
        this.hpPlayer = 30
        this.invincibility = false;
        this.chrono = 0;
        this.hp = 3;
        this.hpEnnemies = 30


        //Ajout de la carte Tiled.
        const carteJardin = this.add.tilemap("jardin");
        const tileset = carteJardin.addTilesetImage(
            "Assets",
            "Phaser_assets"
        );
        const Sols = carteJardin.createLayer(
            "Sols",
            tileset
        );
        const Decor = carteJardin.createLayer(
            "Decor",
            tileset
        );
        const Porte = carteJardin.createLayer(
            "Porte",
            tileset
        );
        const Porte2 = carteJardin.createLayer(
            "Porte2",
            tileset
        );


        //Ajout des collisions avec les objets.
        Decor.setCollisionByProperty({ estSolide: true });
        Porte.setCollisionByExclusion(-1, true);
        Porte2.setCollisionByExclusion(-1, true);


        //Ajout du perso et des collisions.
        this.player = this.physics.add.sprite(0, 0, 'perso');
        this.physics.add.collider(this.player, Porte, this.changeScene, null, this)
        this.physics.add.collider(this.player, Porte2, this.changeScene2, null, this)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, Decor);
        this.physics.world.setBounds(0, 0, 288, 224);

        //Ajout des consommables fleurs.
        this.groupeFleur = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.fleur1 = this.groupeFleur.create(120, 210, 'fleur');
        this.fleur2 = this.groupeFleur.create(210, 40, 'fleur');
        this.physics.add.collider(this.player, this.groupeFleur, this.collectFleur, null, this);

        //Ajout des consommables sushis.
        this.groupeSushi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.sushi1 = this.groupeSushi.create(235, 120, 'sushi');
        this.physics.add.collider(this.player, this.groupeSushi, this.collectSushi, null, this);

        //Ajout de l'ui
        this.uiFleur = this.add.image(440, 255, 'fleur');
        this.uiFleur.setScrollFactor(0);
        this.scoreFleurText = this.add.text(450, 245, this.scoreFleur, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreFleurText.setScrollFactor(0);


        this.uiSushi = this.add.image(477, 243, 'sushi');
        this.uiSushi.setScrollFactor(0);
        this.scoreSushiText = this.add.text(487, 245, this.scoreSushi, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreSushiText.setScrollFactor(0);


        this.uiPansement = this.add.image(518, 248, 'pansement');
        this.uiPansement.setScrollFactor(0);
        this.scorePansementText = this.add.text(527, 245, this.scorePansement, { fontSize: '17px', fill: '#FFFFFF' });
        this.scorePansementText.setScrollFactor(0);


        //Ajout de la caméra.
        this.cameras.main.setBounds(0, 0, 288, 224);
        this.cameras.main.zoom = 3;
        this.cameras.main.startFollow(this.player);
        this.player.setSize(16, 32);

        //Ajout du clavier.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('A,D,SPACE');
    }

    //FONCTION UPDATE
    update() {
        if (this.gameOver) { return; }

        //GAUCHE
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        }

        //DROITE
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        //IMMOBILE
        else {
            this.player.setVelocityX(0);
        }

        //AVANCER (HAUT)
        if (this.cursors.up.isDown) {

            this.player.setVelocityY(-160);
        }
        //AVANCER (BAS)
        else if (this.cursors.down.isDown) {

            this.player.setVelocityY(160);

        }
        //IMMOBILE
        else {
            this.player.setVelocityY(0);
        }

    };

    //Fonction pour amener le joueur à la scène prairie.
    changeScene(player) {
        this.scene.start("ScenePrairie", {
            scoreFleur: this.scoreFleur,
            scorePansement: this.scorePansement,
            scoreSushi: this.scoreSushi,
            scoreFleurText: this.scoreFleurText,
            scorePansementText: this.scorePansementText,
            scoreSushiText: this.scoreSushiText,
            pansementSpawn: this.pansementSpawn,
            hasPchit: this.hasPchit,
        });
    }

    //Fonction pour amener le joueur à la scène maison.
    changeScene2(player) {
        this.scene.start("SceneMaison", {
            scoreFleur: this.scoreFleur,
            scorePansement: this.scorePansement,
            scoreSushi: this.scoreSushi,
            scoreFleurText: this.scoreFleurText,
            scorePansementText: this.scorePansementText,
            scoreSushiText: this.scoreSushiText,
            pansementSpawn: this.pansementSpawn,
            hasPchit: this.hasPchit,
        });
    }

    //Fonction pour récupérer des fleurs.
    collectFleur(player, fleur) {
        fleur.disableBody(true, true);
        this.scoreFleur += 1;
        this.scoreFleurText.setText(+this.scoreFleur);
    }

    //Fonction pour récupérer des sushis.
    collectSushi(player, sushi) {
        sushi.disableBody(true, true);
        this.scoreSushi += 1;
        this.scoreSushiText.setText(+this.scoreSushi);
    }

    //Fonction pour récupérer des pansements.
    collectPansement(player, pansement) {
        pansement.disableBody(true, true);
        this.scorePansement += 1;
        this.scorePansementText.setText(+this.scorePansement);
    }
}

