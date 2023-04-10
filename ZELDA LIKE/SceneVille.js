export class SceneVille extends Phaser.Scene {
    constructor() {
        super("SceneVille");
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
        this.load.tilemapTiledJSON("ville", "ville.json");
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.image('sushi', 'sushi.png');
        this.load.image('fleur', 'fleur.png');
        this.load.image('lampe', 'lampe.png');
        this.load.spritesheet('ennemi', 'ennemi2.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('ennemi2', 'ennemi3.png',
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
        const carteVille = this.add.tilemap("ville");
        const tileset = carteVille.addTilesetImage(
            "Assets",
            "Phaser_assets"
        );
        const Sols = carteVille.createLayer(
            "Sols",
            tileset
        );
        const Decor = carteVille.createLayer(
            "Decor",
            tileset
        );
        const Porte = carteVille.createLayer(
            "Porte",
            tileset
        );
        const Porte2 = carteVille.createLayer(
            "Porte2",
            tileset
        );
        const Porte3 = carteVille.createLayer(
            "Porte3",
            tileset
        );

        //Ajout des collisions avec les objets.
        Decor.setCollisionByProperty({ estSolide: true });
        Porte.setCollisionByExclusion(-1, true);
        Porte2.setCollisionByExclusion(-1, true);
        Porte3.setCollisionByExclusion(-1, true);


        //Ajout du perso et des collisions.
        this.player = this.physics.add.sprite(730, 45, 'perso');
        this.physics.add.collider(this.player, Porte, this.changeScene, null, this)
        this.physics.add.collider(this.player, Porte2, this.changeScene2, null, this)
        this.physics.add.collider(this.player, Porte3, this.changeScene3, null, this)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, Decor);
        this.physics.world.setBounds(0, 0, 832, 512);

        //Ajout des ennemis.
        this.groupeEnnemi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.ennemi = this.groupeEnnemi.create(767, 150, 'ennemi');
        this.ennemi2 = this.groupeEnnemi.create(163, 450, 'ennemi2');

        //Degats ennemis
        this.physics.add.collider(this.player, this.ennemi, this.GetHit, null, this);
        this.physics.add.collider(this.player, this.ennemi2, this.GetHit, null, this);

        //Mort player
        //this.physics.add.collider(this.player, this.ennemi, this.mortPlayer, null, this);
        //this.physics.add.collider(this.player, this.ennemi2, this.mortPlayer, null, this);

        this.groupeHitbox = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.hitbox = this.groupeHitbox.create(767, 45, 'hitboxEnnemi').setSize(100, 100);
        this.hitbox2 = this.groupeHitbox.create(163, 450, 'hitboxEnnemi').setSize(100, 100);

        this.physics.add.overlap(this.player, this.groupeHitbox, this.suivreJoueur, null, this);
        this.physics.add.overlap(this.player, this.groupeHitbox, this.suivreJoueur2, null, this);

        //Ajout des consommables sushis.
        this.groupeSushi = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.sushi1 = this.groupeSushi.create(215, 470, 'sushi');
        this.physics.add.collider(this.player, this.groupeSushi, this.collectSushi, null, this);

        //Ajout des consommables fleurs.
        this.groupeFleur = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });
        this.fleur1 = this.groupeFleur.create(350, 375, 'fleur');
        this.fleur2 = this.groupeFleur.create(727, 360, 'fleur');
        this.physics.add.overlap(this.player, this.groupeFleur, this.collectFleur, null, this);

        this.hpPlayerText = this.add.text(312, 165, '30', { fontSize: '17px', fill: '#FFFFFF' });

        //Ajout du consommable lampe torche qui permet d'accéder à la prairie sombre.
        this.lampe = this.physics.add.sprite(300, 315, 'lampe');
        this.physics.add.collider(this.player, this.lampe, this.collectLampe, null, this);


        //Ajout de la caméra.
        this.cameras.main.setBounds(0, 0, 832, 512);
        this.cameras.main.zoom = 1.8;
        this.cameras.main.startFollow(this.player);
        this.player.setSize(16, 32);

        //Ajout du clavier.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('A');
    }

    //FONCTION UPDATE
    update() {

        //Lignes pour tuer les ennemis avec la touche A.
        if (this.suivre == true && this.hasPchit == true && this.clavier.A.isDown) {
            this.hpEnnemies -= 5;
            if (this.hpEnnemies <= 0) {
                this.ennemi.disableBody(true, true);

            }
        }

        if (this.suivre == true && this.hasPchit == true && this.clavier.A.isDown) {
            this.hpEnnemies -= 5;
            if (this.hpEnnemies <= 0) {
                this.ennemi2.disableBody(true, true);

            }
        }


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

        if (this.gameOver) { return; }
        if (this.suivre2 == true) {
            this.suivreJoueur2()
        }

        this.hitbox.x = this.ennemi.x
        this.hitbox.y = this.ennemi.y

        this.hitbox2.x = this.ennemi2.x
        this.hitbox2.y = this.ennemi2.y


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

    //Fonction pour amener le joueur à la scène maison.
    changeScene(player) {
        this.scene.start("SceneMaison"
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

    //Fonction pour amener le joueur à la scène prairie.
    changeScene2(player) {
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

    //Fonction pour amener le joueur à la scène sombre.
    changeScene3(player) {
        this.scene.start("SceneSombre", {
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
    //Fonction pour récupérer des sushis.
    collectSushi(player, groupeSushi) {
        groupeSushi.disableBody(true, true);
    }
    //Fonction pour récupérer des fleurs.
    collectFleur(player, groupeFleur) {
        groupeFleur.disableBody(true, true);
    }
    //Fonction pour récupérer la lampe.
    collectLampe(player, lampe) {
        lampe.disableBody(true, true);
    }

    //Fonctions pour faire suivre le joueur par les ennemis.
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
    suivreJoueur2(player, ennemi2) {
        this.suivre2 = true

        if (this.ennemi2.x + 3 < this.player.x - 3) {
            this.ennemi2.setVelocityX(50);
        }
        if (this.ennemi2.y - 3 > this.player.y + 3) {
            this.ennemi2.setVelocityY(-50);
        }
        if (this.ennemi2.x - 3 > this.player.x + 3) {
            this.ennemi2.setVelocityX(-50);
        }
        if (this.ennemi2.y + 3 < this.player.y - 3) {
            this.ennemi2.setVelocityY(50);
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

    //Fonctions pour faire mourir le joueur.
    mortPlayer(player, ennemi) {
        if (this.hpPlayer <= 0) {
            this.physics.pause();
            this.gameOver = true;
        }

    }

    mortPlayer2(player, ennemi2) {
        if (this.hpPlayer <= 0) {
            this.physics.pause();
            this.gameOver = true;
        }

    }


}
