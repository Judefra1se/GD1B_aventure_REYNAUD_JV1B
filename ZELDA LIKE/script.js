import {SceneMaison as SceneMaison} from "./sceneMaison.js";
import {SceneJardin as SceneJardin} from "./SceneJardin.js";
import { ScenePrairie as ScenePrairie } from "./ScenePrairie.js";
import { SceneVille as SceneVille } from "./SceneVille.js";
import { SceneSombre as SceneSombre} from "./SceneSombre.js";
import { SceneForet as SceneForet } from "./SceneForet.js";


var config = {
    type: Phaser.AUTO,
    width: 1280, height: 720,
    pixelArt : true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [SceneMaison,SceneJardin,ScenePrairie,SceneVille,SceneSombre,SceneForet]
};
new Phaser.Game(config); 