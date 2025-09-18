import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAllPasswords() {
  try {
    console.log('🔍 Buscando usuarios...');
    
    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
      }
    });

    console.log(`📊 Encontrados ${users.length} usuarios\n`);

    for (const user of users) {
      // Verificar si la contraseña ya está hasheada (empieza con $2a$ o $2b$)
      const isAlreadyHashed = user.password.startsWith('$2a') || 
                              user.password.startsWith('$2b') ||
                              user.password.length > 30; // Los hashes bcrypt son largos
      
      if (isAlreadyHashed) {
        console.log(`✅ ${user.email} - Ya tiene contraseña hasheada`);
        continue;
      }

      console.log(`🔄 ${user.email} - Actualizando contraseña...`);
      console.log(`   📝 Contraseña original: "${user.password}"`);

      // Hashear la contraseña en texto plano
      const hashedPassword = bcryptjs.hashSync(user.password, 10);
      console.log(`   🔐 Hash generado: ${hashedPassword.substring(0, 30)}...`);

      // Actualizar en la base de datos
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

      console.log(`   ✅ Contraseña actualizada exitosamente\n`);
    }

    console.log('🎉 ¡Proceso completado! Todas las contraseñas han sido hasheadas.');
    
  } catch (error) {
    console.error('❌ Error durante la actualización:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
updateAllPasswords();


//node update-passwords.mjs