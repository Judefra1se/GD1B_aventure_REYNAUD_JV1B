export class SceneForet extends Phaser.Scene {
    constructor() {
        super("SceneForet");
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
        this.load.tilemapTiledJSON("foret", "foret.json");
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('boss', 'boss.png',
            { frameWidth: 64, frameHeight: 64 });
    }

    //FONCTION CREATE
    create() {
        this.gameOver = false
        this.hpEnnemies = 200


        //Ajout de la carte Tiled.
        const carteForet = this.add.tilemap("foret");
        const tileset = carteForet.addTilesetImage(
            "Assets",
            "Phaser_assets"
        );
        const Sols = carteForet.createLayer(
            "Sols",
            tileset
        );
        const Decor = carteForet.createLayer(
            "Decor",
            tileset
        );
        const Porte = carteForet.createLayer(
            "Porte",
            tileset
        );

        //Ajout des collisions avec les objets.
        Decor.setCollisionByProperty({ estSolide: true });
        Porte.setCollisionByExclusion(-1, true);


        //Ajout du perso et des collisions.
        this.player = this.physics.add.sprite(0, 0, 'perso');
        this.physics.add.collider(this.player, Porte, this.changeScene, null, this)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, Decor);
        this.physics.world.setBounds(0, 0, 832, 672);

        //Ajout de l'ui
        this.uiFleur = this.add.image(525, 305, 'fleur');
        this.uiFleur.setScrollFactor(0);
        this.scoreFleurText = this.add.text(535, 295, this.scoreFleur, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreFleurText.setScrollFactor(0);
        //this.scoreFleur= 0

        this.uiSushi = this.add.image(560, 293, 'sushi');
        this.uiSushi.setScrollFactor(0);
        this.scoreSushiText = this.add.text(570, 295, this.scoreSushi, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreSushiText.setScrollFactor(0);
        //this.scoreSushi= 0

        this.uiPansement = this.add.image(595, 298, 'pansement');
        this.uiPansement.setScrollFactor(0);
        this.scorePansementText = this.add.text(605, 295, this.scorePansement, { fontSize: '17px', fill: '#FFFFFF' });
        this.scorePansementText.setScrollFactor(0);
        //this.scorePansement= 0

        //Ajout du boss et des collisions.
        this.boss = this.physics.add.sprite(670, 245, 'boss');
        this.physics.add.collider(this.player, this.boss, this.GetHit, null, this);

        this.groupeHitbox = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.hitbox = this.groupeHitbox.create(640, 245, 'hitboxEnnemi').setSize(100, 100);

        this.physics.add.overlap(this.player, this.groupeHitbox, this.suivreJoueur, null, this);

        //Ajout de la caméra.
        this.cameras.main.setBounds(0, 0, 832, 672);
        this.cameras.main.zoom = 1.8;
        this.cameras.main.startFollow(this.player);
        this.player.setSize(16, 32);

        //Ajout du clavier.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('A,D,SPACE');
    }

    //FONCTION UPDATE
    update() {
        if (this.gameOver) { return; }

        //Lignes pour tuer les ennemis avec la touche A.
        if (this.suivre == true && this.hasPchit == true && this.clavier.A.isDown) {
            this.hpEnnemies -= 5;
            if (this.hpEnnemies <= 0) {
                this.boss.disableBody(true, true);
                //this.pansement = this.add.image (400,200, 'pansement')
            }

            this.hitbox.x = this.boss.x
            this.hitbox.y = this.boss.y
        }

        //GAUCHE
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            //this.player.anims.play('left', true);
        }

        //DROITE
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            //this.player.anims.play('right', true);
        }

        //IMMOBILE
        else {
            this.player.setVelocityX(0);
            //this.player.anims.play('turn');
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
            //this.player.anims.play('turn');
        }

    };

    //Fonction pour amener le joueur à la scène ville.
    changeScene(player) {
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

    //Fonction pour faire suivre le joueur par les ennemis.
    suivreJoueur(player, boss) {
        this.suivre = true

        if (this.boss.x + 3 < this.player.x - 3) {
            this.boss.setVelocityX(50);
        }
        if (this.boss.y - 3 > this.player.y + 3) {
            this.boss.setVelocityY(-50);
        }
        if (this.boss.x - 3 > this.player.x + 3) {
            this.boss.setVelocityX(-50);
        }
        if (this.boss.y + 3 < this.player.y - 3) {
            this.boss.setVelocityY(50);
        }
    }

    //Fonction pour que les ennemis infligent des dégats au joueur.
    degatEnnemi(player, hitboxEnnemi) {
        this.hpPlayer -= 1;
        this.hpPlayerText.setText(+this.hpPlayer);
        this.player.setTint(0xff0000);
    }

    //Fonction pour l'invincibilité du joueur
    GetHit(player, hitboxEnnemi) {
        if (this.hp == 3 && this.invincibility == false) {
            this.hp -= 1;
            this.invincibility = true;
        }
        else if (this.hp == 2 && this.invincibility == false) {
            this.hp -= 1;
            this.invincibility = true;
        }
        else if (this.hp == 1 && this.invincibility == false) {
            this.hp = 0;
            this.player.setTint(0xff0000);
            this.gameOver = true;
            this.physics.pause();
        }
    }

    //Fonctions pour faire mourir le joueur.
    mortPlayer(player, ennemi) {
        if (this.hpPlayer <= 0) {
            this.physics.pause();
            this.gameOver = true;
        }

    }
}