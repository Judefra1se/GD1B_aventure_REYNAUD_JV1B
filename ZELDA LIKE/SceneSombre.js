export class SceneSombre extends Phaser.Scene {
    constructor() {
        super("SceneSombre");
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
        this.load.tilemapTiledJSON("sombre", "sombre.json");
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.image('fleur', 'fleur.png');
        this.load.image('sushi', 'sushi.png');
        this.load.spritesheet('ennemi', 'ennemi4.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('hitboxEnnemi', 'hitbox.png',
            { frameWidth: 64, frameHeight: 64 });
    }

    //FONCTION CREATE
    create() {
        this.gameOver = false
        this.suivre = false
        this.suivre2 = false
        this.hpPlayer = 30
        this.invincibility = false;
        this.chrono = 0;
        this.hp = 3;
        this.hpEnnemies = 30


        //Ajout de la carte Tiled.
        const carteSombre = this.add.tilemap("sombre");
        const tileset = carteSombre.addTilesetImage(
            "Assets",
            "Phaser_assets"
        );
        const Sols = carteSombre.createLayer(
            "Sols",
            tileset
        );
        const Decor = carteSombre.createLayer(
            "Decor",
            tileset
        );
        const Porte = carteSombre.createLayer(
            "Porte",
            tileset
        );
        const Porte2 = carteSombre.createLayer(
            "Porte2",
            tileset
        );

        //Ajout des collisions avec les objets.
        Decor.setCollisionByProperty({ estSolide: true });
        Porte.setCollisionByExclusion(-1, true);
        Porte2.setCollisionByExclusion(-1, true);


        //Ajout du perso et des collisions.
        this.player = this.physics.add.sprite(10, 10, 'perso');
        this.physics.add.collider(this.player, Porte, this.changeScene, null, this)
        this.physics.add.collider(this.player, Porte2, this.changeScene2, null, this)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, Decor);
        this.physics.world.setBounds(0, 0, 352, 224);

        //Ajout des ennemis
        this.groupeEnnemi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.ennemi = this.groupeEnnemi.create(193, 105, 'ennemi');

        //Degats ennemis
        this.physics.add.collider(this.player, this.ennemi, this.GetHit, null, this);

        this.groupeHitbox = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.hitbox = this.groupeHitbox.create(193, 105, 'hitboxEnnemi').setSize(100, 100);

        this.physics.add.overlap(this.player, this.groupeHitbox, this.suivreJoueur, null, this);

        //Ajout des consommables fleurs.
        this.groupeFleur = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.fleur1 = this.groupeFleur.create(277, 163, 'fleur');
        this.fleur2 = this.groupeFleur.create(70, 110, 'fleur');
        this.physics.add.collider(this.player, this.groupeFleur, this.collectFleur, null, this);

        //Ajout des consommables sushis.
        this.groupeSushi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.sushi1 = this.groupeSushi.create(303, 183, 'sushi');
        this.physics.add.collider(this.player, this.groupeSushi, this.collectSushi, null, this);

        //Ajout de l'ui
        this.uiFleur = this.add.image(525, 305, 'fleur');
        this.uiFleur.setScrollFactor(0);
        this.scoreFleurText = this.add.text(535, 295, this.scoreFleur, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreFleurText.setScrollFactor(0);


        this.uiSushi = this.add.image(560, 293, 'sushi');
        this.uiSushi.setScrollFactor(0);
        this.scoreSushiText = this.add.text(570, 295, this.scoreSushi, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreSushiText.setScrollFactor(0);


        this.uiPansement = this.add.image(595, 298, 'pansement');
        this.uiPansement.setScrollFactor(0);
        this.scorePansementText = this.add.text(605, 295, this.scorePansement, { fontSize: '17px', fill: '#FFFFFF' });
        this.scorePansementText.setScrollFactor(0);


        //Ajout de la caméra.
        this.cameras.main.setBounds(0, 0, 352, 224);
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
            this.hpEnnemies -= 10;
            if (this.hpEnnemies <= 0) {
                this.ennemi.disableBody(true, true);
            }
        }

        this.hitbox.x = this.ennemi.x
        this.hitbox.y = this.ennemi.y

        //Lignes pour créer l'invincibilité du joueur.
        if (this.invincibility == true) {
            if (this.chrono < 80) {
                this.chrono++;
                this.player.setTint("#FFFFFF");
            }
            if (this.chrono >= 80) {
                this.invincibility = false;
                this.chrono = 0;
                this.player.setTint("#FFFFFF");
            }
        }

        if (this.gameOver) { return; }
        if (this.suivre == true) {
            this.suivreJoueur()
        };

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
    //Fonction pour amener le joueur à la scène forêt.
    changeScene(player) {
        this.scene.start("SceneForet", {
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
    //Fonction pour amener le joueur à la scène ville.
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
    suivreJoueur(player, ennemi) {
        this.suivre = true

        if (this.ennemi.x + 3 < this.player.x - 3) {
            this.ennemi.setVelocityX(50);
        }
        if (this.ennemi.y - 3 > this.player.y + 3) {
            this.ennemi.setVelocityY(-50);
        }
        if (this.ennemi.x - 3 > this.player.x + 3) {
            this.ennemi.setVelocityX(-50);
        }
        if (this.ennemi.y + 3 < this.player.y - 3) {
            this.ennemi.setVelocityY(50);
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