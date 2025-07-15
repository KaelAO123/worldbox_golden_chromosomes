from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random

app = Flask(__name__)
DATA_FILE = 'genes.json'
CORS(app)
def leer_datos():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def escribir_datos(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
@app.route("/genes",methods=['GET'])
def obtener_genes():
    genes = leer_datos()
    return jsonify(genes)

@app.route("/genes/aleatorios", methods=["GET"])
def genes_aleatorios():
    genes = leer_datos()
    random.shuffle(genes)
    return jsonify(genes)

@app.route("/genes/<int:id>",methods=["GET"])
def obtener_gen(id):
    genes = leer_datos()
    gen = next((i for i in genes if i["id"] == id), None)
    if gen:
        return jsonify(gen)
    return jsonify({"error":"Gen no encontrado"}),404

@app.route("/genes/nombres/<string:nombre>",methods=["GET"])
def buscar_por_nombre(nombre):
    genes = leer_datos()
    buscado = [i for i in genes if nombre.lower() in i["nombre"].lower()]
    return jsonify(buscado)

@app.route("/genes",methods = ["POST"])
def agregar_gen():
    nuevo = request.get_json()
    genes = leer_datos()
    nuevo["id"]=max([i["id"] for i in genes], default=-1)+1
    genes.append(nuevo)
    escribir_datos(genes)
    return jsonify(nuevo),201

@app.route("/genes/<int:id>",methods=["PUT"])
def actualizar_gen(id):
    genes = leer_datos()
    gen = next((i for i in genes if i["id"] == id), None)
    if not gen:
        return jsonify({"error":"Gen no encontrado"}),404
    
    actualizacion = request.get_json()
    gen.update(actualizacion)
    escribir_datos(genes)
    return jsonify(gen)

if __name__ == '__main__':
    app.run(debug=True)
