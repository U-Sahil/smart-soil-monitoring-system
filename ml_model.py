# imports
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# dataset
data = {
    "temperature": [20, 25, 30, 35, 28, 22],
    "humidity": [80, 60, 40, 30, 50, 70],
    "gas": [200, 250, 300, 350, 280, 220],
    "crop": ["Rice", "Wheat", "Millet", "Millet", "Maize", "Rice"]
}

df = pd.DataFrame(data)

X = df[["temperature", "humidity", "gas"]]
y = df["crop"]

model = RandomForestClassifier()
model.fit(X, y)

# function
def predict_crop(temp, hum, gas):
    result = model.predict([[temp, hum, gas]])
    return result[0]


# 🔥 PUT YOUR CODE HERE (VERY LAST)
import sys

if __name__ == "__main__":
    temp = float(sys.argv[1])
    hum = float(sys.argv[2])
    gas = float(sys.argv[3])

    print(predict_crop(temp, hum, gas))