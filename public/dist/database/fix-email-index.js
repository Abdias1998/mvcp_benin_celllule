"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function fixEmailIndex() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI not found in environment variables');
        }
        console.log('🔌 Connexion à MongoDB...');
        await (0, mongoose_1.connect)(mongoUri);
        console.log('✅ Connecté à MongoDB');
        const db = mongoose_1.connection.db;
        const usersCollection = db.collection('users');
        console.log('\n📋 Index existants:');
        const indexes = await usersCollection.indexes();
        console.log(JSON.stringify(indexes, null, 2));
        try {
            console.log('\n🗑️  Suppression de l\'index email_1...');
            await usersCollection.dropIndex('email_1');
            console.log('✅ Index email_1 supprimé');
        }
        catch (error) {
            if (error.code === 27) {
                console.log('ℹ️  Index email_1 n\'existe pas, pas besoin de le supprimer');
            }
            else {
                throw error;
            }
        }
        try {
            console.log('\n🗑️  Suppression de l\'index contact_1...');
            await usersCollection.dropIndex('contact_1');
            console.log('✅ Index contact_1 supprimé');
        }
        catch (error) {
            if (error.code === 27) {
                console.log('ℹ️  Index contact_1 n\'existe pas, pas besoin de le supprimer');
            }
            else {
                throw error;
            }
        }
        console.log('\n🧹 Nettoyage des emails vides...');
        const result1 = await usersCollection.updateMany({ $or: [{ email: '' }, { email: null }] }, { $unset: { email: '' } });
        console.log(`✅ ${result1.modifiedCount} documents nettoyés (email)`);
        console.log('\n🧹 Nettoyage des contacts vides...');
        const result2 = await usersCollection.updateMany({ $or: [{ contact: '' }, { contact: null }] }, { $unset: { contact: '' } });
        console.log(`✅ ${result2.modifiedCount} documents nettoyés (contact)`);
        console.log('\n🔨 Création du nouvel index email avec sparse: true...');
        await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true, name: 'email_1' });
        console.log('✅ Index email_1 créé avec sparse: true');
        console.log('\n🔨 Création du nouvel index contact avec sparse: true...');
        await usersCollection.createIndex({ contact: 1 }, { unique: true, sparse: true, name: 'contact_1' });
        console.log('✅ Index contact_1 créé avec sparse: true');
        console.log('\n📋 Nouveaux index:');
        const newIndexes = await usersCollection.indexes();
        console.log(JSON.stringify(newIndexes, null, 2));
        console.log('\n✅ Migration terminée avec succès!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}
fixEmailIndex();
//# sourceMappingURL=fix-email-index.js.map