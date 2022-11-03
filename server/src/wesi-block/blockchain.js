const Block = require('./block');
const {Hash_m} =require('./hash')

class Blockchain{
    constructor(){
        this.chain = [Block.genesis];
    }

    async addBlock(data){
        const previousBlock = this.chain[this.chain.length - 1];
        const block = await Block.minado(previousBlock, data);
        this.chain.push(block);
        return block;
    }
}

// class Blockchain{
//     constructor(){
//         this.chain = [];
//         this.height = -1;
//         this.inicioChain();
//     }

//     async inicioChain(){
//         if (this.height === -1){
//             const block = new Block_wesi({data:'Bloque Genesis'});
//             await this.addBlock(block);
//         }
//     }
//     addBlock(block){
//         let self = this;
//         return new Promise(async(resolve, reject)=>{
//             block.height = self.chain.length;
//             block.time = new Date().getTime().toString();

//             if(self.chain.length > 0){
//                 block.previoBlockHash = self.chain[self.chain.length - 1].hash;
//             }
//             let errors = await self.validarChain();
//             if (errors.length > 0){
//                 reject(new Error('El chain no es valido', errors))
//             }

//             block.hash = await Hash_wesi(block);
//             self.chain.push(block)
//             resolve(block);
//         })
//     }

//     validarChain(){
//         let self = this;
//         const errors = [];
//         return new Promise(async(resolve,reject)=>{
//             self.chain.map(async (block)=>{
//                 try{
//                     let isValid = await block.validar();
//                     if (!isValid){
//                         errors.push(new Error(`El block ${block.height} no es valido`));
//                     }
//                 }catch (err){
//                     errors.push(err)
//                 }
//             })

//             resolve(errors)
//         })
//     }
//     print(){
//         let self = this;
//         for (let block of self.chain){
//             console.log(block.toString())
//         }
//     }
// }

module.exports = Blockchain