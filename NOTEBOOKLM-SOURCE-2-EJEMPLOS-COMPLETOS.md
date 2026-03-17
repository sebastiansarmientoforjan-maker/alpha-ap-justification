# Ejemplos Completos CERC - Fuente para NotebookLM

## Ejemplo 1: Mean Value Theorem (Error-Forcing)

### Problema:
Considera la función f(x) = 1/x² en el intervalo [-1, 1].
Aplica el Teorema del Valor Medio para encontrar un valor c en (-1, 1) tal que f'(c) = [f(1) - f(-1)] / [1 - (-1)].

---

### RESPUESTA INCORRECTA (Estudiante Empírico):

**Claim:** Por el MVT, existe c tal que f'(c) = 0

**Evidence:**
- f(1) = 1
- f(-1) = 1
- f'(x) = -2/x³

**Reasoning:** El MVT dice que f'(c) = [f(b) - f(a)] / (b - a)

**Conditions:** [VACÍO - el estudiante saltó este paso]

**Intento de solución:**
```
f'(c) = [1 - 1] / [1 - (-1)] = 0/2 = 0
-2/c³ = 0
No tiene solución... ???
```

**Por qué falló:** No verificó que f sea continua en [-1, 1]

---

### RESPUESTA CORRECTA (Estudiante Formal):

**Claim:** El Teorema del Valor Medio NO aplica a f(x) = 1/x² en [-1, 1]

**Evidence:**
- f(x) = 1/x² está definida para x ≠ 0
- En x = 0: f(0) no está definida
- lim(x→0) f(x) = ∞
- El intervalo [-1, 1] contiene x = 0

**Reasoning:**
El Teorema del Valor Medio requiere que f sea continua en el intervalo cerrado [a,b]. La continuidad significa que lim(x→c) f(x) = f(c) para todo c en [a,b].

**Conditions:**
❌ **Condición 1: f continua en [-1, 1]**
  - En x = 0 ∈ [-1, 1]: lim(x→0) f(x) = ∞
  - f(0) no está definida
  - Por lo tanto, f NO es continua en x = 0
  - **Hipótesis violada → MVT NO aplica**

❓ Condición 2: f diferenciable en (-1, 1)
  - No necesitamos verificar porque ya falló la primera condición

**Conclusión:** Dado que f no cumple las hipótesis del MVT, no podemos aplicar el teorema. No existe tal c.

---

## Ejemplo 2: Intermediate Value Theorem (Correcto)

### Problema:
Sea g(x) = x³ - 3x + 1 en el intervalo [0, 2].
Usa el Teorema del Valor Intermedio para justificar que existe c en (0, 2) tal que g(c) = 0.

---

### RESPUESTA COMPLETA CERC:

**Claim:**
Por el Teorema del Valor Intermedio, existe al menos un valor c en el intervalo (0, 2) tal que g(c) = 0.

**Evidence:**
- g(x) = x³ - 3x + 1
- g(0) = (0)³ - 3(0) + 1 = 1
- g(2) = (2)³ - 3(2) + 1 = 8 - 6 + 1 = 3
- Observación: g(0) = 1 > 0 y g(2) = 3 > 0

**Espera... esto NO funciona aún. Necesitamos encontrar donde g cambia de signo.**

Probemos más puntos:
- g(1) = (1)³ - 3(1) + 1 = 1 - 3 + 1 = -1

Ahora sí:
- g(0) = 1 > 0
- g(1) = -1 < 0
- El valor k = 0 está entre g(0) y g(1)

**Reasoning:**
El Teorema del Valor Intermedio establece que si f es continua en [a,b] y k es cualquier valor entre f(a) y f(b), entonces existe al menos un c en (a,b) tal que f(c) = k.

En nuestro caso: g es continua en [0, 1], y 0 está entre g(0) = 1 y g(1) = -1, por lo tanto existe c en (0, 1) tal que g(c) = 0.

**Conditions:**
✓ **Condición 1: g debe ser continua en [0, 1]**
  - g(x) = x³ - 3x + 1 es una función polinomial
  - Las funciones polinomiales son continuas en todos los números reales
  - Por lo tanto, g es continua en [0, 1] ⊆ ℝ
  - **Hipótesis cumplida ✓**

✓ **Condición 2: 0 debe estar entre g(0) y g(1)**
  - g(0) = 1
  - g(1) = -1
  - Dado que -1 < 0 < 1, tenemos g(1) < 0 < g(0)
  - **Hipótesis cumplida ✓**

**Conclusión:** Como ambas condiciones del IVT se cumplen, podemos concluir que existe c en (0, 1) tal que g(c) = 0.

---

## Ejemplo 3: Continuidad (Definition Direct)

### Problema:
Determina si la función h(x) es continua en x = 3, donde:
```
h(x) = { x² - 1     si x < 3
       { 2x + 2     si x ≥ 3
```

---

### RESPUESTA COMPLETA CERC:

**Claim:**
La función h es continua en x = 3.

**Evidence:**
Calculamos los límites laterales y el valor de la función:

**Límite por la izquierda:**
lim(x→3⁻) h(x) = lim(x→3⁻) (x² - 1) = (3)² - 1 = 9 - 1 = 8

**Límite por la derecha:**
lim(x→3⁺) h(x) = lim(x→3⁺) (2x + 2) = 2(3) + 2 = 6 + 2 = 8

**Valor de la función:**
h(3) = 2(3) + 2 = 8  (usamos la segunda pieza porque x = 3 cae en x ≥ 3)

**Reasoning:**
Por la definición de continuidad, una función f es continua en x = c si y solo si se cumplen tres condiciones:
1. f(c) existe
2. lim(x→c) f(x) existe
3. lim(x→c) f(x) = f(c)

Para funciones por partes, el límite existe si y solo si los límites laterales son iguales.

**Conditions:**
Verificamos las tres condiciones de continuidad:

✓ **Condición 1: h(3) existe**
  - h(3) = 8 (calculado usando la regla para x ≥ 3)
  - **Cumplida ✓**

✓ **Condición 2: lim(x→3) h(x) existe**
  - Para que el límite exista, necesitamos: lim(x→3⁻) h(x) = lim(x→3⁺) h(x)
  - lim(x→3⁻) h(x) = 8
  - lim(x→3⁺) h(x) = 8
  - Como 8 = 8, el límite existe y lim(x→3) h(x) = 8
  - **Cumplida ✓**

✓ **Condición 3: lim(x→3) h(x) = h(3)**
  - lim(x→3) h(x) = 8
  - h(3) = 8
  - Como 8 = 8, la tercera condición se cumple
  - **Cumplida ✓**

**Conclusión:** Como las tres condiciones de continuidad se cumplen, h es continua en x = 3.

---

## Ejemplo 4: Extreme Value Theorem

### Problema:
Considera f(x) = x² - 4x + 3 en el intervalo [0, 5].
Justifica que f tiene un valor máximo absoluto en este intervalo.

---

### RESPUESTA COMPLETA CERC:

**Claim:**
Por el Teorema del Valor Extremo, la función f(x) = x² - 4x + 3 tiene un valor máximo absoluto en el intervalo [0, 5].

**Evidence:**
- f(x) = x² - 4x + 3 es una función polinomial de grado 2
- El intervalo [0, 5] es un intervalo cerrado y acotado
- Dominio de f: todos los números reales ℝ
- El intervalo [0, 5] ⊆ ℝ (está contenido en el dominio)

**Reasoning:**
El Teorema del Valor Extremo (Extreme Value Theorem - EVT) establece que si una función f es continua en un intervalo cerrado y acotado [a, b], entonces f alcanza tanto un valor máximo absoluto como un valor mínimo absoluto en ese intervalo.

**Conditions:**
El EVT requiere dos condiciones:

✓ **Condición 1: f debe ser continua en [0, 5]**
  - f(x) = x² - 4x + 3 es una función polinomial
  - **Teorema:** Todas las funciones polinomiales son continuas en todos los números reales
  - Como [0, 5] ⊂ ℝ, entonces f es continua en [0, 5]
  - **Hipótesis cumplida ✓**

✓ **Condición 2: [0, 5] debe ser un intervalo cerrado y acotado**
  - Cerrado: Incluye ambos endpoints: 0 ∈ [0, 5] y 5 ∈ [0, 5] ✓
  - Acotado: Tiene límites finitos: 0 y 5 son números reales finitos ✓
  - **Hipótesis cumplida ✓**

**Conclusión:** Como f cumple ambas condiciones del Teorema del Valor Extremo, podemos concluir que f alcanza un valor máximo absoluto en [0, 5].

*(Nota: El EVT solo garantiza EXISTENCIA del máximo, no lo calcula. Para encontrar el valor, necesitaríamos evaluar f en los puntos críticos y endpoints.)*

---

## Ejemplo 5: Diferenciabilidad implica Continuidad

### Problema:
Una función g es diferenciable en x = 2, y g'(2) = 5.
¿Es g necesariamente continua en x = 2? Justifica tu respuesta.

---

### RESPUESTA COMPLETA CERC:

**Claim:**
Si g es diferenciable en x = 2, entonces g es necesariamente continua en x = 2.

**Evidence:**
- Dado: g es diferenciable en x = 2
- Dado: g'(2) = 5 (aunque el valor específico no es necesario para la justificación)
- Por definición de diferenciabilidad: lim(h→0) [g(2+h) - g(2)] / h existe y es igual a 5

**Reasoning:**
**Teorema:** Si una función es diferenciable en un punto, entonces es continua en ese punto.

**Demostración del teorema:**
Para que g sea continua en x = 2, necesitamos probar que lim(x→2) g(x) = g(2).

Sea x = 2 + h, entonces cuando x → 2, tenemos h → 0.

Queremos probar: lim(h→0) g(2+h) = g(2)

Manipulación algebraica:
```
lim(h→0) g(2+h) = lim(h→0) [g(2+h) - g(2) + g(2)]
                 = lim(h→0) [g(2+h) - g(2)] + lim(h→0) g(2)
                 = lim(h→0) [(g(2+h) - g(2))/h · h] + g(2)
                 = [lim(h→0) (g(2+h) - g(2))/h] · [lim(h→0) h] + g(2)
                 = g'(2) · 0 + g(2)
                 = 0 + g(2)
                 = g(2)
```

Por lo tanto, lim(x→2) g(x) = g(2), lo que significa que g es continua en x = 2.

**Conditions:**
✓ **Condición del teorema: g debe ser diferenciable en x = 2**
  - Dado explícitamente en el problema: "g es diferenciable en x = 2"
  - **Hipótesis cumplida ✓**

**Conclusión:** Como g cumple la condición de ser diferenciable en x = 2, y hemos probado que diferenciabilidad implica continuidad, concluimos que g es continua en x = 2.

**Nota importante:** El converso NO es cierto. Una función puede ser continua en un punto pero NO diferenciable ahí (ejemplo: f(x) = |x| en x = 0).

---

## Patrones de Error Comunes a Identificar

### Error 1: "Se ve continuo"
```
Claim: f es continua en x = 2
Evidence: La gráfica no tiene saltos
Conditions: [vacío]
```
**Problema:** No verificó la definición formal de continuidad.

### Error 2: "Lo probé con un número"
```
Claim: f(c) = 0 para algún c en (1,2)
Evidence: f(1.5) = -0.3, que está cerca de 0
Conditions: [vacío]
```
**Problema:** Razonamiento empírico. No usó IVT. No verificó continuidad.

### Error 3: "El teorema dice..."
```
Claim: Por MVT, f'(c) = ...
Evidence: f(1) = 2, f(3) = 8
Reasoning: MVT dice que...
Conditions: f es continua y diferenciable (sin verificar)
```
**Problema:** Afirma las condiciones sin verificarlas.

---

**Use este documento en NotebookLM para:**
- Generar ejemplos similares
- Crear problemas de práctica
- Identificar patrones de errores estudiantiles
- Entrenar modelos de evaluación automática
