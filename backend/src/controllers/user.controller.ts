import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, email, password: hash },
    });

    res.json(user);
};

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.update({
        where: { id: Number(id) },
        data: req.body,
    });

    res.json(user);
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    await prisma.user.delete({ where: { id: Number(id) } });

    res.json({ message: "Deleted" });
};