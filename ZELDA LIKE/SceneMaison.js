//SCENE 1 MAISON

export class SceneMaison extends Phaser.Scene {
    constructor() {
        super("SceneMaison");
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
        this.load.tilemapTiledJSON("maison", "maison.json");
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.image('pansement', "pansement.png");
        this.load.image("sushi", "sushi.png");
        this.load.image('fleur', 'fleur.png');
        this.load.image('pchit', 'pchit.png');
    }

    //FONCTION CREATE
    create() {

        //Variables
        this.gameOver = false;
        this.hasPchit = false;


        //Ajout de la carte Tiled.
        const carteMaison = this.add.tilemap("maison");
        const tileset = carteMaison.addTilesetImage(
            "Assets",
            "Phaser_assets"
        );
        const Sols = carteMaison.createLayer(
            "Sols",
            tileset
        );
        const Decor = carteMaison.createLayer(
            "Decor",
            tileset
        );
        const Porte = carteMaison.createLayer(
            "Porte",
            tileset
        );
        const Porte2 = carteMaison.createLayer(
            "Porte2",
            tileset
        );

        //Ajout des collisions avec les objets.
        Decor.setCollisionByProperty({ estSolide: true });
        Porte.setCollisionByExclusion(-1, true);
        Porte2.setCollisionByExclusion(-1, true);


        //Ajout des animations
        this.anims.create({
            key: 'front',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'back',
            frames: this.anims.generateFrameNumbers('perso', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 18, end: 23 }),
            frameRate: 10,
            repeat: -1
        });


        //Ajout du perso et des collisions.
        this.player = this.physics.add.sprite(100, 30, 'perso');
        this.physics.add.collider(this.player, Porte, this.changeScene, null, this)
        this.physics.add.collider(this.player, Porte2, this.changeScene2, null, this)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, Decor);
        this.physics.world.setBounds(0, 0, 192, 160);

        //Ajout des consommables pansements.
        this.groupePansement = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.pansement1 = this.groupePansement.create(47, 120, "pansement");
        this.physics.add.collider(this.player, this.groupePansement, this.collectPansement, null, this);

        //Ajout des consommables sushis.
        this.groupeSushi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.sushi1 = this.groupeSushi.create(47, 28, 'sushi');
        this.physics.add.collider(this.player, this.groupeSushi, this.collectSushi, null, this);

        //Ajout du consommable Pchit qui permet de tuer les ennemis.
        this.groupePchit = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.pchit1 = this.groupePchit.create(70, 50, 'pchit');
        this.physics.add.overlap(this.player, this.groupePchit, this.collectPchit, null, this);


        //Ajout de l'ui
        this.uiFleur = this.add.image(525, 305, 'fleur');
        this.uiFleur.setScrollFactor(0);
        this.scoreFleurText = this.add.text(535, 295, this.scoreFleur, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreFleurText.setScrollFactor(0);
        this.scoreFleur = 0

        this.uiSushi = this.add.image(560, 293, 'sushi');
        this.uiSushi.setScrollFactor(0);
        this.scoreSushiText = this.add.text(570, 295, this.scoreSushi, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreSushiText.setScrollFactor(0);
        this.scoreSushi = 0

        this.uiPansement = this.add.image(595, 298, 'pansement');
        this.uiPansement.setScrollFactor(0);
        this.scorePansementText = this.add.text(605, 295, this.scorePansement, { fontSize: '17px', fill: '#FFFFFF' });
        this.scorePansementText.setScrollFactor(0);
        this.scorePansement = 0

        this.uipchit = this.add.image(630, 300, 'pchit');
        this.uipchit.setScrollFactor(0);
        this.scorepchitText = this.add.text(645, 295, this.scorepchit, { fontSize: '17px', fill: '#FFFFFF' });
        this.scorepchitText.setScrollFactor(0);
        this.scorepchit = 0


        //Ajout de la caméra.
        this.cameras.main.setBounds(0, 0, 192, 160);
        this.cameras.main.zoom = 5;
        this.cameras.main.startFollow(this.player);
        this.player.setSize(16, 32);

        //Ajout du clavier.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('A');
    }


    //FONCTION UPDATE
    update() {
        if (this.gameOver) { return; }

        //Ajout des déplacements du joueur
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

        if (this.clavier.A.isDown) {
            this.player.attackEnnemies();

        }
    }
    //Fonction pour amener le joueur dans le jardin.
    changeScene(player) {
        this.scene.start("SceneJardin", {
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

    //Fonction pour amener le joueur dans la ville.
    changeScene2(player) {
        this.scene.start("SceneVille", {
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
    //Fonction pour récupérer des pansements.
    collectPansement(player, pansement) {
        pansement.disableBody(true, true);
        this.scorePansement += 1;
        this.scorePansementText.setText(+this.scorePansement);
    }

    //Fonction pour récupérer des sushis.
    collectSushi(player, sushi) {
        sushi.disableBody(true, true);
        this.scoreSushi += 1;
        this.scoreSushiText.setText(+this.scoreSushi);
    }

    //Fonction pour récupérer le spray.
    collectPchit(player, pchit) {
        this.hasPchit = true
        pchit.disableBody(true, true);
        this.scorepchit += 1;
        this.scorepchitText.setText(+this.scorepchit);
    }

    //Fonction pour attaquer les ennemis
    attackEnnemies(player, ennemies) {
        if (this.hasPchit = true);
        this.hpEnnemies -= 10;
    }

    //Fonction pour faire mourir les ennemis.
    mortEnnemies(ennemies) {
        if (this.hpEnnemies <= 0);
        ennemies.disableBody(true, true);
        this.physics.add.image('pansement')
    }
}
