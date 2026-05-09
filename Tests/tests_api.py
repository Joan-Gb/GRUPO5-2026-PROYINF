import unittest
import requests

class TestPrestamosAPI(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        print("Iniciando tests de API...")

    @classmethod
    def tearDownClass(cls):
        print("Tests de API finalizados.")

    
    def test_01_simulacion_valida(self):
        datos = {"cliente_id": "1", "monto": 5000000, "plazo_meses": 48, "tasa_anual": 0.15}
        respuesta = requests.post("http://localhost:3000/api/simulations", json=datos)
        
        self.assertEqual(respuesta.status_code, 201)

    def test_02_simulacion_invalida(self):
        datos = {"cliente_id": "1", "plazo_meses": 48, "tasa_anual": 0.15}
        respuesta = requests.post("http://localhost:3000/api/simulations", json=datos)
        
        self.assertEqual(respuesta.status_code, 400)

    def test_03_sugerida_frontera(self):
        datos = {"cliente_id": "1", "renta_liquida": 1000000, "antiguedad_laboral": 11, "plazo_meses": 36}
        respuesta = requests.post("http://localhost:3000/api/simulations/sugerida", json=datos)
        
        self.assertEqual(respuesta.status_code, 201)
        self.assertEqual(respuesta.json()["evaluacion_riesgo"]["probabilidad"], "Baja")

    def test_04_sugerida_renta_cero(self):
        datos = {"cliente_id": "1", "renta_liquida": 0, "antiguedad_laboral": 24, "plazo_meses": 36}
        respuesta = requests.post("http://localhost:3000/api/simulations/sugerida", json=datos)
        
        self.assertEqual(respuesta.status_code, 400)

if __name__ == '__main__':
    unittest.main()