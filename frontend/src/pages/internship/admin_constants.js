export const DEFAULT_DAY1 = `# Day 1 — What is Machine Learning?
Understand ML fundamentals, its 3 types, real-world applications, and set up your Python environment for the internship.

:::wyl
- What ML is and why it matters in 2025
- 3 types: Supervised, Unsupervised, Reinforcement
- Real-world ML apps you use daily
- Setup Python + Jupyter environment
:::

## 📖 Core Concept

:::concept
### Machine Learning — Complete Deep Dive

## What is Machine Learning?

Machine Learning (ML) ek aisa AI technology hai jisme computers data se automatically patterns seekhte hain bina explicitly program kiye. Yeh idea 1950s mein Alan Turing ne propose ki thi, aur aaj 2025 mein ML har jagah hai. [Read the full history on Wikipedia](https://en.wikipedia.org/wiki/Machine_learning)

Traditional programming mein aap **rules likhte the** aur computer unhe follow karta tha. ML mein aap **data dete ho** aur machine khud rules discover karti hai.

#### Traditional Programming vs. Machine Learning

- **Traditional:** Rules + Data → Output
- **Machine Learning:** Data + Output → Rules (automatically)
- **Real-world difference:** Spam filter ka example — manually "free money", "click here" jaise 500 rules likhna vs. 10,000 emails dikhao aur model khud seekh le

#### Why ML in 2025?

- Data explosion: Har din 2.5 quintillion bytes data generate hota hai
- Computing power: GPUs ne training 100x faster bana di
- Open-source tools: TensorFlow, PyTorch, Scikit-learn free available hain
- Industry demand: ML engineers top 3 most-hired roles mein hain

## 3 Types of Machine Learning

#### 1. Supervised Learning — Labelled Data

Data mein **input aur correct output dono** hote hain. Model inhe dekhkar mapping seekhta hai.

- **Examples:** Email spam detection, house price prediction, image classification, medical diagnosis
- **Algorithm families:** Linear Regression, Decision Trees, SVMs, Neural Networks
- **When to use:** Jab aapke paas labeled training data ho aur ek specific output predict karna ho

\`\`\`python
# Simple Supervised Learning Example
from sklearn.linear_model import LinearRegression
import numpy as np

# Training data: [size_sqft] -> price_lakh
X = np.array([[500], [800], [1000], [1200], [1500]])
y = np.array([25, 40, 50, 60, 75])

model = LinearRegression()
model.fit(X, y)

# Predict price for 1100 sqft house
predicted = model.predict([[1100]])
print("Predicted price: Rs.", round(predicted[0], 1), "Lakh")
# Output: Predicted price: Rs. 55.0 Lakh
\`\`\`

#### 2. Unsupervised Learning — No Labels

Data mein **sirf inputs hain, koi labels nahi.** Model khud groups ya patterns dhundta hai.

- **Examples:** Customer segmentation, anomaly detection, topic modeling, recommendation systems
- **Algorithm families:** K-Means, DBSCAN, PCA, Autoencoders
- **When to use:** Jab labels nahi hain aur hidden structure discover karni ho

\`\`\`python
# Customer Segmentation Example
from sklearn.cluster import KMeans
import numpy as np

# Customer data: [age, monthly_spend]
customers = np.array([
    [25, 2000], [28, 1800], [35, 8000],
    [40, 9500], [22, 1500], [45, 10000]
])

kmeans = KMeans(n_clusters=2, random_state=42)
labels = kmeans.fit_predict(customers)
print("Segments:", labels)
# 0 = Budget customers, 1 = Premium customers
\`\`\`

#### 3. Reinforcement Learning — Trial & Error

Agent ek **environment mein actions leta hai** aur reward ya penalty paata hai. Woh maximize karna seekhta hai total reward.

- **Examples:** Game AI (Chess, Go, Dota2), Robot locomotion, Trading bots, Self-driving cars
- **Key concepts:** Agent, Environment, State, Action, Reward, Policy
- **When to use:** Jab koi labeled dataset nahi hai aur sequential decision-making chahiye

## Real-World ML Applications You Use Daily

1. **Google Search** — Query understanding aur result ranking (BERT model)
2. **Netflix/YouTube** — Content recommendation (Collaborative Filtering + Deep Learning)
3. **Gmail Spam Filter** — Text classification (Naive Bayes → now Transformer-based)
4. **Face Unlock** — Facial recognition (Convolutional Neural Networks)
5. **Voice Assistants** — Speech-to-text aur intent classification (RNNs + Attention)
6. **Credit Scoring** — Risk prediction (Gradient Boosting — XGBoost/LightGBM)
7. **Medical Imaging** — Tumor detection in X-rays (ResNet, U-Net architectures)
8. **GPT/Gemini/Claude** — Language understanding aur generation (Transformers)

## Key Terminology to Know

#### Core Terms

- **Feature (X):** Input variables jo model use karta hai (e.g., house size, age, income)
- **Label (y):** Output variable jo predict karna hai (e.g., price, category)
- **Training Data:** Data jis par model seekhta hai
- **Test Data:** Unseen data jis par model evaluate hota hai
- **Model:** Mathematical function jo input → output map karta hai
- **Overfitting:** Model training data bahut well seekh leta hai but test data par fail karta hai
- **Underfitting:** Model kuch bhi sahi se nahi seekhta — too simple

#### Evaluation Metrics

- **Accuracy:** Kitne predictions sahi the (classification ke liye)
- **R² Score:** Kitna variance explain hua (regression ke liye, 0–1, higher = better)
- **RMSE:** Root Mean Square Error — prediction ki average error in same units
- **Precision/Recall:** Imbalanced datasets ke liye (e.g., fraud detection, medical diagnosis)
:::

:::concept
### 3 Types of ML — Visual Summary

## Quick Reference Table

#### Supervised Learning

- **Data:** Labelled (input + correct output)
- **Goal:** Predict output for new inputs
- **Algorithms:** Linear Regression, Logistic Regression, SVM, Random Forest, Neural Nets
- **Use cases:** Price prediction, spam detection, image classification

#### Unsupervised Learning

- **Data:** Unlabelled (only inputs)
- **Goal:** Discover hidden structure/patterns
- **Algorithms:** K-Means, Hierarchical Clustering, PCA, Autoencoders
- **Use cases:** Customer segmentation, dimensionality reduction, anomaly detection

#### Reinforcement Learning

- **Data:** No dataset — learns from interaction
- **Goal:** Maximize cumulative reward
- **Algorithms:** Q-Learning, Policy Gradient, PPO, A3C
- **Use cases:** Game AI, robotics, autonomous vehicles, trading

## Choosing the Right Type

1. **Kya tumhare paas labelled data hai?** → Yes → Supervised Learning
2. **Labels nahi hain, patterns dhundne hain?** → Unsupervised Learning
3. **Sequential decisions + feedback environment?** → Reinforcement Learning
4. **Nahi pata kya use karna hai?** → Start with Supervised — sabse zyada industry applications hain
:::


## 🎥 Video Resources

:::video
url: https://www.youtube.com/watch?v=ukzFI9rgwfU
title: Machine Learning in 100 Seconds — Fireship
meta: YouTube · 2 min · Quick overview
duration: 1:42
required: true
:::

:::video
url: https://www.youtube.com/watch?v=aircAruvnKk
title: Neural Networks from Scratch — 3Blue1Brown
meta: YouTube · 19 min · Deep dive (optional)
duration: 19:13
required: false
:::

## 💻 Hands-On — Environment Setup

:::important
### Before You Code
Python 3.9+ installed hona chahiye. Check karo: \`python --version\` terminal mein. Agar nahi hai toh python.org se install karo pehle.
:::

:::code python
### Step 1 — Library Installation
# Terminal mein run karo (not in Python file)
pip install numpy pandas matplotlib scikit-learn jupyter

# Verify installation
pip list | grep -E "numpy|pandas|matplotlib|scikit"
:::

:::code python
### Step 2 — Test Setup in Jupyter
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import datasets

# Test karo
print("NumPy version:", np.__version__)
print("Pandas version:", pd.__version__)
print("✅ Setup complete! Ready for Day 2.")

# Jupyter start karo — terminal mein:
# jupyter notebook
:::

:::image
url: https://r2.careerwizard.ai/aiml/day1/jupyter-screenshot.png
caption: Jupyter Notebook interface — yahan aapka saara ML code chalega is internship mein
alt: Jupyter notebook screenshot
:::

:::tip
### Pro Tip
NumPy aur Pandas — yeh 2 libraries practically har ML project mein use hoti hain. Aaj ka goal sirf environment ready karna hai, detail mein next days mein cover hoga.

Kuch important tips:
- Jupyter notebook ko hamesha same folder se start karein jahan data hai.
- \`!pip install pkg\` use karke Jupyter ke andar se hi packages install kar sakte hain.
- Google Colab ek best alternative hai agar PC slow hai toh.
:::

:::keypoints
### Key Takeaways — Day 1
Aaj humne ML ke absolute basics aur landscape ko samjha. 

- **ML = data se patterns seekhna**, explicit rules nahi likhne
- **Supervised:** labelled data → predict output
- **Unsupervised:** unlabelled data → find patterns
- **Reinforcement:** reward/penalty se seekhna
- **Python + Jupyter** = industry standard ML setup

Next day hum seedha hands-on coding shuru karenge Pandas ke sath!
:::

:::quiz
Q: Supervised Learning mein kya hota hai?
A: Data mein koi labels nahi hote, model khud groups dhundta hai
B: Model labelled examples se input-output mapping seekhta hai
C: Model environment mein actions lekar reward se seekhta hai
D: Koi bhi data ki zarurat nahi hoti
CORRECT: B
EXPLAIN: Supervised = labelled data. Jaise spam/not-spam emails — model ne examples dekhe aur seekha. Unsupervised mein labels nahi hote.
:::`;

export const DEFAULT_DAY5 = `:::task-hero
# Task 1 —
## House Price Predictor
Apply everything from Day 1–4: NumPy, Pandas, Matplotlib, Seaborn, aur Scikit-Learn. Ek complete ML project banao — data load se model evaluation tak. GitHub pe submit karo.
- Estimated: 3–4 hours
- Due: 11:59 PM Today
- Max 2 attempts
- Pass score: 60/100
:::

:::warning
### Pre-Task Reminder
Day 1–4 mein jo seekha — NumPy, Pandas, Visualization, Sklearn — aaj sab use hoga. Koi bhi concept bhool gaye? **Upar wale days review karo pehle** task shuru karne se.
:::

## 🎯 Choose Your Level

:::requirements
### BEGINNER
- pandas se CSV file load karo aur explore karo
- df.head(), df.info(), df.describe() run karo
- matplotlib se minimum 2 charts banao (line + bar)
- LinearRegression model train karo
- R2 score aur MSE print karo
- README.md mein project explain karo

### INTERMEDIATE
- Kaggle House Prices dataset use karo (link neeche)
- Missing values handle karo — imputation strategy explain karo
- Seaborn correlation heatmap banao — top features identify karo
- LinearRegression aur Ridge Regression compare karo
- Cross-validation (k=5) se model validate karo
- Feature importance plot banao
- Jupyter notebook properly documented ho — Markdown cells

### ADVANCED
- 4 models compare karo: LinearRegression, Ridge, Lasso, RandomForest
- GridSearchCV se hyperparameter tuning karo
- sklearn Pipeline use karo (preprocessing + model together)
- Model joblib se save karo aur load back karo
- Simple Streamlit UI banao — user input le ke price predict kare
- Streamlit Cloud pe deploy karo — live URL submit karo
:::

## 📦 Dataset

:::concept
### House Prices Dataset — Kaggle
**Source:** kaggle.com/c/house-prices | **Format:** CSV | **Size:** ~1,400 rows

Key columns:
- **GrLivArea** — Living area in sqft
- **BedroomAbvGr** — Bedroom count
- **FullBath** — Full bathrooms
- **YearBuilt** — Construction year
- **SalePrice** — 🎯 Target variable (what you predict)

Download from Kaggle → unzip → place \`house_prices.csv\` in your project folder.
:::

## 🎥 Resources

:::video
url: https://www.youtube.com/watch?v=Y0L4-Zq5TGY
title: House Price Prediction — Full ML Project Tutorial
meta: YouTube · 25 min · Watch before starting
duration: 25:00
required: true
:::

:::video
url: https://www.youtube.com/watch?v=pYOVoSBU0aM
title: Sklearn LinearRegression + Cross Validation
meta: YouTube · 15 min · Intermediate concept
duration: 15:00
required: false
:::

## 💻 Starter Code

:::code python
### house_price_predictor.py — Start Here
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

# ── TODO 1: Load dataset ───────────────────────────
df = pd.read_csv('house_prices.csv')

# ── TODO 2: Explore data ───────────────────────────
print(df.head())
print(df.info())
print(df.describe())

# ── TODO 3: Handle missing values ──────────────────
print(df.isnull().sum())
# df.fillna(df.mean(), inplace=True)

# ── TODO 4: Visualize (min 2 charts) ──────────────
# Chart 1: SalePrice distribution
plt.hist(df['SalePrice'], bins=40, color='steelblue')
plt.title('Sale Price Distribution')
plt.show()

# Chart 2: Correlation heatmap
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('Feature Correlation')
plt.show()

# ── TODO 5: Features and target ────────────────────
X = df[['GrLivArea', 'BedroomAbvGr', 'FullBath', 'YearBuilt']]
y = df['SalePrice']

# ── TODO 6: Train/Test split ───────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── TODO 7: Train model ────────────────────────────
model = LinearRegression()
model.fit(X_train, y_train)

# ── TODO 8: Evaluate ───────────────────────────────
y_pred = model.predict(X_test)
print(f"R2 Score:  {r2_score(y_test, y_pred):.3f}")
print(f"RMSE:      {np.sqrt(mean_squared_error(y_test, y_pred)):.0f}")

# ── TODO 9: Predict new house ──────────────────────
new_house = [[2200, 3, 2, 2005]]
price = model.predict(new_house)
print(f"Predicted price: \${price[0]:,.0f}")
:::

:::tip
### Pro Tip — Data Exploration First!
Hamesha yaad rakhein, **Garbage In = Garbage Out**. Modeling se pehle apna zyada time data ko samajhne mein lagayein:
- \`df.head(10)\` aur \`df.sample(5)\` use karke actual data dekhein.
- \`df.describe()\` se numerical columns ka mean, min, max aur outliers check karein.
- \`df.info()\` se missing values aur data types confirm karein.
Bina soche model fit karne se results humesha kharab aayenge!
:::

:::warning
### ⚠️ Version Control Warning
- **Never commit large datasets:** GitHub par 100MB se badi files allow nahi hoti. Hamesha apni \`.csv\` files ko \`.gitignore\` mein add karein.
- **API Keys:** Agar aap koi API use kar rahe hain, toh keys ko \`.env\` file mein rakhein.
- **Readme is mandatory:** Evaluator aapka code nahi, apka \`README.md\` padhega. Usme project summary zarur likhein.
:::

:::important
### 📊 Understanding R² Score (Accuracy Metric)
Model banane ke baad uski accuracy check karna sabse zaroori hai. Regression models ke liye R² score use hota hai:
- **\`> 0.85\` (Excellent):** Aapka model bohot accha predict kar raha hai.
- **\`0.70 – 0.85\` (Good):** Model theek hai, but hyperparameter tuning se better ho sakta hai.
- **\`0.50 – 0.70\` (Average):** Thodi aur feature engineering ki zaroorat hai.
- **\`< 0.50\` (Poor):** Model sahi se patterns nahi pakad paa raha.
- **Negative (\`< 0\`):** Model mean se bhi kharab perform kar raha hai! Data leakage check karein.
:::

## 📊 AI Scoring

:::scoring
SCORE: Correctness|25|25
SCORE: Approach & Logic|25|25
SCORE: Code Quality|25|25
SCORE: Documentation|25|25
PASS: Minimum Pass Score|60|100
:::

## ✅ Pre-Submit Checklist

:::checklist
- GitHub repo public hai (private nahi)
- README.md hai aur project explain karta hai
- Jupyter notebook mein sare cells run hue hain
- R2 score printed in output
- Minimum 2 visualization charts hain
- No API keys ya passwords code mein hain
- CSV file .gitignore mein add ki hai
:::

:::submit
:::

:::important
### After Submit
AI review 2–5 minutes mein complete hoga. Score aur detailed feedback email pe aayega. **Pass (60+)** → Day 6 unlock hoga. **Fail** → ek aur attempt milega 48 ghante ke andar.
:::`;

export const SNIPPETS = {
  concept: `:::concept\n### Your Main Topic Title\n\n## Section 1 — Introduction\n\nYour explanation paragraph here. Use **bold** for key terms and \`inline code\` for code references.\n\n#### Sub-heading\n\n- Bullet point one\n- Bullet point two with **bold** text\n- Third point here\n\n\`\`\`python\n# Code example\nx = 10\nprint(x * 2)\n\`\`\`\n\n## Section 2 — Deep Dive\n\n1. Numbered item one\n2. Numbered item two\n3. Numbered item three\n:::`,
  image: ':::image\nurl: https://your-image-url.com/image.png\ncaption: Your image caption here\nalt: Alt text for accessibility\n:::',
  video: ':::video\nurl: https://youtube.com/watch?v=YOUR_ID\ntitle: Video Title Here\nmeta: YouTube · 10 min · Overview\nduration: 10:30\nrequired: true\n:::',
  code: ':::code python\n### Code Block Title\n# Your code here\nimport numpy as np\n\narr = np.array([1, 2, 3])\nprint(arr.mean())\n:::',
  'callout-tip': ':::tip\n### Pro Tip\nYour helpful tip text goes here. **Bold** and `inline code` supported.\n:::',
  'callout-warning': ':::warning\n### Warning\nImportant warning message here.\n:::',
  quiz: ':::quiz\nQ: Your question here?\nA: Option A text\nB: Option B text\nC: Option C text\nD: Option D text\nCORRECT: B\nEXPLAIN: Explanation of the correct answer here.\n:::',
  keypoints: ':::keypoints\n### Key Takeaways\n- First key point here\n- Second key point here\n- Third key point here\n- Fourth key point here\n:::',
  'task-hero': ':::task-hero\n# Task 1 —\n## House Price Predictor\nApply everything from Day 1–4: NumPy, Pandas, Matplotlib, Seaborn, Sklearn. Full ML project.\n- Estimated: 3–4 hours\n- Due: 11:59 PM Today\n- Max 2 attempts\n- Pass score: 60/100\n:::',
  requirements: ':::requirements\n### BEGINNER\n- pandas se CSV load karo\n- matplotlib se 2 charts banao\n- LinearRegression model train karo\n- R2 score print karo\n\n### INTERMEDIATE\n- Kaggle dataset use karo\n- Missing values handle karo\n- Seaborn heatmap banao\n- Cross-validation use karo\n\n### ADVANCED\n- 4 models compare karo\n- GridSearchCV use karo\n- Streamlit UI banao\n- Deploy karo\n:::',
  resources: ':::resources\ntitle: Resources & Learning Understanding\ndesc: Upload learning materials — images, PDFs, documents, and more.\n:::',
  link: '[Your Link Text](https://example.com)'
};
