import { prisma } from "./src/lib/prisma";
import bcrypt from "bcrypt";

async function seedUser() {
    try {
        const email = "usuario@test.com";
        const password = "123456789";

        // Hash del password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`✓ El usuario ${email} ya existe en la base de datos`);
            console.log(`  Email: ${existingUser.email}`);
            console.log(`  ID: ${existingUser.id}`);
            return;
        }

        // Crear el usuario
        const user = await prisma.user.create({
            data: {
                name: "Usuario Test",
                email,
                password: hashedPassword,
            },
        });

        console.log("✓ Usuario creado exitosamente!");
        console.log(`\n📧 Email: ${user.email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`\nUSA ESTAS CREDENCIALES PARA PROBAR EL LOGIN`);
    } catch (error) {
        console.error("Error al crear el usuario:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedUser();
