const { assert } = require('chai');

const document = artifacts.require("document");
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('document',(accounts)=>{
    //write tests here
    let doc ;
    before(async ()=>{
        doc = await document.deployed()
    })
    describe('deployment',async()=>{
        it('deploys successfully',async()=>{
            
            const address = doc.address
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
            assert.notEqual(address,0x0)
        })
    })


    describe('storage',async () => {
        it('updates the fileHash',async()=>{
            let fileHash
            fileHash = 'abc123'
            await doc.set(fileHash)
            const result = await doc.get()
            assert.equal(result,fileHash)
        })
    })
})
