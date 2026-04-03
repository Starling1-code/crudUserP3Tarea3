import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, email, password: hash },
    });

    res.json(user);
};

export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
        const hash = await bcrypt.hash(password, 10);
        updateData.password = hash;
    }

    const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
    });

    res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.user.delete({ where: { id: Number(id) } });

    res.json({ message: "Deleted" });
};