import random

class Gen:
    colores = ["Rojo","Azul","Amarrillo","Verde"]
    def __init__(self,nombre,rama1,rama2,rama3,rama4,visitado=False):
        self.nombre = nombre
        self.ramas = [self.colores[rama1],self.colores[rama2],self.colores[rama3],self.colores[rama4]]
        self.visitado = visitado
    
    def __str__(self):
        return f"{self.nombre} [{self.ramas}]"
    
    def obtener_rama(self,numero_rama):
        return self.ramas[numero_rama]

class Casilla:
    def __init__(self):
        self.gen = None
        self.casillas = [None,None,None,None]
    
    def conectar_casilla(self, posicion, casilla):
        self.casillas[posicion-1] = casilla
        casilla.casillas[(posicion+1)%4] = self
            
    def __str__(self):
        return f"{self.gen.nombre if self.gen else "No hay gen"}"
    
    def insertar_gen_dorado(self,gen):
        for i in range(len(self.casillas)):
            if not self.casillas[i]:
                continue
            if self.casillas[i].gen:
                rama_conexion = self.casillas[i].gen.obtener_rama((i+2)%4)
                rama = gen.ramas[i]
                if rama_conexion != rama:
                    return False
        self.gen = gen
        return True
        
def cromosoma_dorado(casilla_index, cromosoma, genes):
    if casilla_index == len(cromosoma):
        return True 
    casilla_actual = cromosoma[casilla_index]
    
    for gen in genes:
        if casilla_actual.insertar_gen_dorado(gen):
            if cromosoma_dorado(casilla_index + 1, cromosoma, genes):
                return True
            casilla_actual.gen = None
    return False

def cromosoma_dorado_no_repetido(casilla_index, cromosoma, genes_disponibles):
    if casilla_index == len(cromosoma):
        return True 

    casilla_actual = cromosoma.get(casilla_index)
    
    for i in range(len(genes_disponibles)):
        gen = genes_disponibles[i]
        if casilla_actual.insertar_gen_dorado(gen):
            siguiente_genes = genes_disponibles[:i] + genes_disponibles[i+1:] 
            if cromosoma_dorado_no_repetido(casilla_index + 1, cromosoma, siguiente_genes):
                return True
            casilla_actual.gen = None
    return False 

# ? colores = ["Rojo","Azul","Amarrillo","Verde"]
GENES = [
    Gen("Warfare III",1,3,2,2),
    Gen("Warfare II",0,1,2,3),
    Gen("Warfare I",1,0,1,2),
    Gen("Stewardhip III",2,1,3,3),
    Gen("Stewardhip II",1,2,0,2),
    Gen("Stewardhip I",0,0,0,3),
    Gen("Stamina III",1,2,2,3),
    Gen("Stamina II",0,0,1,2),
    Gen("Stamina I",1,3,1,3),
    Gen("Speed III",2,2,0,2),
    Gen("Speed II",3,0,0,3),
    Gen("Speed I",0,1,2,2),
    Gen("Bigger Size",1,1,0,0),
    # Gen("Smaller Size",2,0,0,1),
    Gen("Offspring IV",0,3,3,0),
    Gen("Offspring III",1,1,0,1),
    Gen("Offspring II",3,0,0,0),
    Gen("Offspring I",2,3,2,1),
    Gen("Lifespan IV", 2,0,2,0),
    Gen("Lifespan III",1,1,1,1),
    Gen("Lifespan II",0,2,1,0),
    Gen("Lifespan I",1,0,3,1),
    Gen("Intelligence III", 3,1,1,2),
    Gen("Intelligence II",2,2,1,3),
    Gen("Intelligence I",3,0,3,2),
    Gen("Health V",0,1,3,2),
    Gen("Health IV",2,0,3,3),
    Gen("Health III",3,3,0,2),
    Gen("Health II",2,1,0,3),
    Gen("Health I",3,2,2,1),
    Gen("Diplomacy III",3,3,1,0),
    Gen("Diplomacy II",2,1,3,2),
    Gen("Diplomacy I",3,2,3,0),
    Gen("Damage III",1,0,2,0),
    Gen("Damage II",0,3,2,1),
    Gen("Damage I",1,1,1,0),
    Gen("Birth Rate I",3,2,1,0),
    Gen("Attack Speed",0,2,2,1),
    Gen("Armor III",3,0,1,1),
    Gen("Armor II",2,3,3,0),
    Gen("Armor I",3,1,3,3)
]
n = 10
cromosoma = {i : Casilla() for i in range(n)}

cromosoma[0].conectar_casilla(1,cromosoma[1])
cromosoma[0].conectar_casilla(3,cromosoma[2])
cromosoma[1].conectar_casilla(2,cromosoma[5])
cromosoma[2].conectar_casilla(2,cromosoma[3])
cromosoma[3].conectar_casilla(2,cromosoma[4])
cromosoma[4].conectar_casilla(1,cromosoma[5])
cromosoma[4].conectar_casilla(2,cromosoma[7])
cromosoma[5].conectar_casilla(2,cromosoma[6])
cromosoma[6].conectar_casilla(3,cromosoma[7])
cromosoma[7].conectar_casilla(2,cromosoma[8])

random.shuffle(GENES)

if cromosoma_dorado_no_repetido(0, cromosoma, GENES):
    for i in sorted(cromosoma):
        print(f"{i}: {cromosoma[i]}")
else:
    print("No fue posible generar un cromosoma dorado.")