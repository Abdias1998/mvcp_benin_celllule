import { connect, connection } from 'mongoose';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function fixEmailIndex() {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }

    console.log('🔌 Connexion à MongoDB...');
    await connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    const db = connection.db;
    const usersCollection = db.collection('users');

    // 1. Lister les index existants
    console.log('\n📋 Index existants:');
    const indexes = await usersCollection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // 2. Supprimer l'ancien index email_1 s'il existe
    try {
      console.log('\n🗑️  Suppression de l\'index email_1...');
      await usersCollection.dropIndex('email_1');
      console.log('✅ Index email_1 supprimé');
    } catch (error: any) {
      if (error.code === 27) {
        console.log('ℹ️  Index email_1 n\'existe pas, pas besoin de le supprimer');
      } else {
        throw error;
      }
    }

    // 3. Supprimer l'ancien index contact_1 s'il existe
    try {
      console.log('\n🗑️  Suppression de l\'index contact_1...');
      await usersCollection.dropIndex('contact_1');
      console.log('✅ Index contact_1 supprimé');
    } catch (error: any) {
      if (error.code === 27) {
        console.log('ℹ️  Index contact_1 n\'existe pas, pas besoin de le supprimer');
      } else {
        throw error;
      }
    }

    // 4. Nettoyer les documents avec email vide ou null
    console.log('\n🧹 Nettoyage des emails vides...');
    const result1 = await usersCollection.updateMany(
      { $or: [{ email: '' }, { email: null }] },
      { $unset: { email: '' } }
    );
    console.log(`✅ ${result1.modifiedCount} documents nettoyés (email)`);

    // 5. Nettoyer les documents avec contact vide ou null
    console.log('\n🧹 Nettoyage des contacts vides...');
    const result2 = await usersCollection.updateMany(
      { $or: [{ contact: '' }, { contact: null }] },
      { $unset: { contact: '' } }
    );
    console.log(`✅ ${result2.modifiedCount} documents nettoyés (contact)`);

    // 6. Créer les nouveaux index avec sparse: true
    console.log('\n🔨 Création du nouvel index email avec sparse: true...');
    await usersCollection.createIndex(
      { email: 1 },
      { unique: true, sparse: true, name: 'email_1' }
    );
    console.log('✅ Index email_1 créé avec sparse: true');

    console.log('\n🔨 Création du nouvel index contact avec sparse: true...');
    await usersCollection.createIndex(
      { contact: 1 },
      { unique: true, sparse: true, name: 'contact_1' }
    );
    console.log('✅ Index contact_1 créé avec sparse: true');

    // 7. Vérifier les nouveaux index
    console.log('\n📋 Nouveaux index:');
    const newIndexes = await usersCollection.indexes();
    console.log(JSON.stringify(newIndexes, null, 2));

    console.log('\n✅ Migration terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
fixEmailIndex();
