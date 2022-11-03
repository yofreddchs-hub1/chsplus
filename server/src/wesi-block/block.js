const {Hash_wesi, Hash_m} =require('./hash')

const DIFICULTAD = 3;
const MINE_RATE = 3000;
class Block {
    constructor(time, previoHash, hash, data, nonce, dificultad){
        this.time=time;
        this.previoHash= previoHash;
        this.hash= hash;
        this.data = data;
        this.nonce = nonce;
        this.dificultad = dificultad;

    }

    static get genesis(){
        const time = new Date('2018-02-19').getTime();
        return new this(
            time,
            undefined,
            'hash genesis',
            'Bloque Genesis',
            0,
            DIFICULTAD
        )
    }

    static async minado( previousBlock, data){
        const {hash: previoHash} = previousBlock;
        let {dificultad} = previousBlock;
        let hash;
        let time;
        let nonce= 0;
        do{
            time = Date.now();
            nonce +=1;
            dificultad = previousBlock.time + MINE_RATE > time ? dificultad + 1 : dificultad -1 ;
            hash = await Hash_m(previoHash + time + data + nonce + dificultad);
        }while (hash.substring(0, dificultad) !== '0'.repeat(dificultad))

        return new this(time, previoHash, hash, data, nonce, dificultad);
    }

    toString() {
        const {time, previoHash, hash, data, nonce, dificultad} = this;
        return`Block-
            time:${time}
            previoHash:${previoHash}
            hash:${hash}
            data:${data}
            nonce:${nonce}
            dificultad:${dificultad}
            ------------------------------------------
        `;
    }
}
module.exports = Block;
// class Block_wesi{
//     constructor(data){
//         this.hash = null;
//         this.height = 0;
//         this.body = Buffer.from(JSON.stringify(data).toString('hex'));
//         this.time = 0;
//         this.previoBlockHash = '';
//     }

//     validar(){
//         const self = this;
//         return new Promise(async(resolve, reject)=>{
//             let currentHash = self.hash;
//             self.hash = await Hash_wesi({...self, hash: null});
//             if (currentHash !== self.hash){
//                 return resolve(false);
//             }
//             resolve(true);
//         })
//     }

//     getBlockData(){
//         const self = this;
//         return new Promise((resolve, reject)=>{
//             let Datacodificada = self.body;
//             let Datadecodificada = Buffer.from(Datacodificada, 'hex').toString();
//             let ObjetoData = JSON.parse(Datadecodificada);

//             if (ObjetoData === 'Bloque Genesis'){
//                 reject (new Error('Este es el Bloque Genesis'));
//             }

//             resolve(ObjetoData);
//         })
//     }

//     toString(){
//         const {hash, height, body, time, previoBlockHash} = this;
//         return `Block- 
//             hash: ${hash}
//             height: ${height}
//             body: ${body}
//             time: ${time}
//             previoBlockHash: ${previoBlockHash}
//             -------------------------------------------------
//         `;
//     }
// }

// module.exports = Block_wesi