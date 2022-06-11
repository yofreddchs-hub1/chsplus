const { Schema, model } = require('mongoose');

    const proveedorSchema = new Schema(
        {
            campos: {},
            valores:{},
            actualizado:String,
        }, {
            timestamps: true
        });
        proveedorSchema.index({'$**': 'text'});
    module.exports = model('Proveedor', proveedorSchema);