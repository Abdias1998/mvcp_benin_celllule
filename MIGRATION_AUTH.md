# Migration : Authentification avec Email OU Téléphone

## Modifications apportées

### 1. Schéma User (`src/users/schemas/user.schema.ts`)
- ✅ Le champ `email` est maintenant **optionnel** (`email?: string`)
- ✅ Le champ `email` a l'attribut `unique: true, sparse: true` pour permettre les valeurs nulles tout en gardant l'unicité
- ✅ Le champ `contact` a l'attribut `unique: true, sparse: true` pour garantir l'unicité des numéros de téléphone

### 2. Types TypeScript (`src/shared/types.ts`)
- ✅ Interface `User` : champ `email` rendu optionnel
- ✅ Interface `PastorData` : champ `email` rendu optionnel

### 3. DTOs d'authentification

#### RegisterDto (`src/auth/dto/register.dto.ts`)
- ✅ Le champ `email` est maintenant optionnel
- ✅ Le champ `contact` est maintenant optionnel
- ✅ Ajout d'un validateur personnalisé `@AtLeastOne(['email', 'contact'])` pour s'assurer qu'au moins l'un des deux est fourni
- ✅ Validation conditionnelle avec `@ValidateIf` pour valider l'email seulement s'il est fourni

#### LoginDto (`src/auth/dto/login.dto.ts`)
- ✅ Remplacement du champ `email` par `identifier` (peut être un email ou un numéro de téléphone)
- ✅ Le système détecte automatiquement si l'identifiant est un email (contient @) ou un numéro de téléphone

### 4. Services

#### UsersService (`src/users/users.service.ts`)
- ✅ Ajout de `findByContact(contact: string)` : recherche un utilisateur par numéro de téléphone
- ✅ Ajout de `findByEmailOrContact(identifier: string)` : recherche un utilisateur par email OU téléphone
  - Détecte automatiquement le type d'identifiant (email si contient @, sinon téléphone)

#### AuthService (`src/auth/auth.service.ts`)
- ✅ Méthode `validateUser` : accepte maintenant un `identifier` au lieu de `email`
- ✅ Méthode `login` : utilise `identifier` et met à jour le payload JWT pour inclure `email` et `contact`
- ✅ Méthode `register` : 
  - Vérifie qu'au moins l'email ou le téléphone est fourni
  - Vérifie l'unicité de l'email (si fourni)
  - Vérifie l'unicité du téléphone (si fourni)

### 5. Stratégie JWT (`src/auth/strategies/jwt.strategy.ts`)
- ✅ Le payload JWT accepte maintenant `email?`, `contact?` et `role` en plus de `sub`

### 6. Validateur personnalisé (`src/auth/validators/at-least-one.validator.ts`)
- ✅ Nouveau décorateur `@AtLeastOne` pour valider qu'au moins un champ parmi plusieurs est fourni

## Impact sur l'API

### Endpoint d'inscription : `POST /auth/register`

**Avant :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",  // OBLIGATOIRE
  "password": "password123",
  "contact": "0123456789",      // OPTIONNEL
  "role": "district_pastor",
  "region": "Region A"
}
```

**Maintenant :**
```json
// Option 1 : Avec email uniquement
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "district_pastor",
  "region": "Region A"
}

// Option 2 : Avec téléphone uniquement
{
  "name": "John Doe",
  "contact": "0123456789",
  "password": "password123",
  "role": "district_pastor",
  "region": "Region A"
}

// Option 3 : Avec les deux
{
  "name": "John Doe",
  "email": "john@example.com",
  "contact": "0123456789",
  "password": "password123",
  "role": "district_pastor",
  "region": "Region A"
}
```

### Endpoint de connexion : `POST /auth/login`

**Avant :**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Maintenant :**
```json
// Connexion avec email
{
  "identifier": "john@example.com",
  "password": "password123"
}

// OU connexion avec téléphone
{
  "identifier": "0123456789",
  "password": "password123"
}
```

## Messages d'erreur

- ❌ Si ni email ni téléphone fourni : `"Vous devez fournir au moins un email ou un numéro de téléphone."`
- ❌ Si email déjà utilisé : `"Un utilisateur avec cet email existe déjà."`
- ❌ Si téléphone déjà utilisé : `"Un utilisateur avec ce numéro de téléphone existe déjà."`
- ❌ Si identifiants incorrects : `"Email/Téléphone ou mot de passe incorrect."`

## Notes importantes

1. **Index MongoDB** : Les index `unique` et `sparse` sur les champs `email` et `contact` permettent :
   - L'unicité des valeurs non-nulles
   - La possibilité d'avoir des valeurs nulles multiples

2. **Détection automatique** : Le système détecte automatiquement si l'identifiant est un email (présence de @) ou un numéro de téléphone

3. **Rétrocompatibilité** : Les utilisateurs existants avec email continueront de fonctionner normalement

4. **Validation du téléphone** : Le format attendu est `01XXXXXXXX` (10 chiffres commençant par 01)
