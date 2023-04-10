export class ScenePrairie extends Phaser.Scene {
    constructor() {
        super("ScenePrairie");
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
        this.load.tilemapTiledJSON("prairie", "prairie.json");
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.image('fleur', 'fleur.png');
        this.load.spritesheet('ennemi', 'ennemi.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('hitboxEnnemi', 'hitbox.png',
            { frameWidth: 64, frameHeight: 64 });
    }

    //FONCTION CREATE
    create() {

        //Variables.
        this.gameOver = false
        this.suivre = false
        this.hpEnnemies = 100


        //Ajout de la carte Tiled.
        const cartePrairie = this.add.tilemap("prairie");
        const tileset = cartePrairie.addTilesetImage(
            "Assets",
            "Phaser_assets"
        );
        const Sols = cartePrairie.createLayer(
            "Sols",
            tileset
        );
        const Decor = cartePrairie.createLayer(
            "Decor",
            tileset
        );
        const Porte = cartePrairie.createLayer(
            "Porte",
            tileset
        );
        const Porte2 = cartePrairie.createLayer(
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
        this.physics.world.setBounds(0, 0, 544, 384);

        //Ajout des ennemis.
        this.groupeEnnemi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.ennemi = this.groupeEnnemi.create(510, 10, 'ennemi');
        //this.physics.add.collider(this.player, this.ennemi, null, this);

        //Degats ennemis
        this.physics.add.collider(this.player, this.ennemi, this.GetHit, null, this);

        this.groupeHitbox = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.hitbox = this.groupeHitbox.create(510, 10, 'hitboxEnnemi').setSize(100, 100);

        this.physics.add.overlap(this.player, this.groupeHitbox, this.suivreJoueur, null, this);


        //Ajout des consommables fleurs.
        this.groupeFleur = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.fleur1 = this.groupeFleur.create(60, 260, 'fleur');
        this.fleur2 = this.groupeFleur.create(230, 40, 'fleur');
        this.fleur3 = this.groupeFleur.create(345, 60, 'fleur');
        this.physics.add.collider(this.player, this.groupeFleur, this.collectFleur, null, this);

        //Ajout des consommables sushis.
        this.groupeSushi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.sushi1 = this.groupeSushi.create(510, 45, 'sushi');
        this.physics.add.collider(this.player, this.groupeSushi, this.collectSushi, null, this);

        //Ajout de l'ui
        this.uiFleur = this.add.image(300, 175, 'fleur');
        this.uiFleur.setScrollFactor(0);
        this.scoreFleurText = this.add.text(312, 165, this.scoreFleur, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreFleurText.setScrollFactor(0);

        this.uiSushi = this.add.image(338, 163, 'sushi');
        this.uiSushi.setScrollFactor(0);
        this.scoreSushiText = this.add.text(349, 165, this.scoreSushi, { fontSize: '17px', fill: '#FFFFFF' });
        this.scoreSushiText.setScrollFactor(0);


        this.uiPansement = this.add.image(375, 169, 'pansement');
        this.uiPansement.setScrollFactor(0);
        this.scorePansementText = this.add.text(385, 165, this.scorePansement, { fontSize: '17px', fill: '#FFFFFF' });
        this.scorePansementText.setScrollFactor(0);


        //Ajout de la caméra.
        this.cameras.main.setBounds(0, 0, 544, 384);
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

    //Fonction pour amener le joueur à la scène jardin.
    changeScene2(player) {
        this.scene.start("SceneJardin"
            , {
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

    //Fonction pour l'invincibilité du joueur.
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
    //Fonction pour faire mourir le joueur.
    mortPlayer(player, ennemi) {
        if (this.hpPlayer <= 0) {
            this.physics.pause();
            this.gameOver = true;
        }
    }
}