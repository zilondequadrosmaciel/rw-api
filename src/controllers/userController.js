import multer from 'multer';
import fs from 'fs-extra';
import { pool } from "../db.js";
import path from 'path';


const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/');
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        callback(null, `image-${Date.now()}.${ext}`)
    },
})

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new Error("only image is allowed"))
    }
}

const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
})

export const uploadImage = upload.single('files');

export const create = async (req, res) => {
    const image = req.file.filename;
    const { description, detail, color, model, brand, price } = req.body;
    const sql = 'INSERT INTO bag (DESCRIPTION, DETAIL, COLOR, MODEL, BRAND, PRICE, IMAGE) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await pool.query(sql, [description, detail, color, model, brand, price, image]);
    res.status(200).json({ message: "success" })
};


export const all = async (_req, res) => {
    const [row] = await pool.query('SELECT * FROM bag');
    res.json(row);
};

export const remove = async (req, res) => {
    const id = req.params.id;
    const selectQuery = 'SELECT image FROM bag WHERE id = ?'
    const [row] = await pool.query(selectQuery, [id]);


    function objToString(obj) {
        var str = '';
        for (var p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                str = obj[p];
            }
        }
        return str;
    }
    try {
        await fs.unlink(path.resolve("./public/" + objToString(row[0])));
        const query = 'DELETE FROM bag WHERE id = ?';
        await pool.query(query, [id]);
        res.json("Removed all bags");
    } catch (error) {
        res.json("not found");
    }
}


export const removeAll = async (_req, res) => {
    await pool.query('DELETE FROM bag');
    res.json("Removed all bags");
}
