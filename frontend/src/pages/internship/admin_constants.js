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
### ML kya hota hai?
Machine Learning ek AI ka part hai jisme computer data se khud seekhta hai bina explicitly program kiye. Traditional programming mein aap rules likhte the — ML mein aap data dete ho aur machine khud rules discover karti hai.

**Simple example:** Spam filter — aapne manually rules nahi likhe. Aapne 10,000 spam emails dikhaye aur model ne khud patterns seekhe.
:::

:::analogy
🍕
### SIMPLE ANALOGY
Bacche ko pizza pehchanna sikhana — 1000 pizza photos aur 1000 non-pizza photos dikhao. Baccha patterns seekh leta hai (round, cheesy, toppings) bina koi rule bataye. Yahi ML karta hai, but millions of examples ke saath.
:::

:::image
url: https://r2.careerwizard.ai/aiml/day1/ml-types-diagram.png
caption: 3 Types of Machine Learning — Supervised, Unsupervised aur Reinforcement ka comparison
alt: ML types diagram
:::

:::concept
### 3 Types of ML — Ek Ek Samjho
**1. Supervised Learning** — Labelled data dete ho. Model input → output mapping seekhta hai. Example: House price prediction, spam detection, image classification.

**2. Unsupervised Learning** — Unlabelled data. Model khud groups/patterns dhundta hai. Example: Customer segmentation, anomaly detection.

**3. Reinforcement Learning** — Agent environment mein actions leta hai, reward/penalty milta hai. Example: Chess AI, game bots, robot control.
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
NumPy aur Pandas — yeh 2 libraries practically har ML project mein use hoti hain. Aaj ka goal sirf: environment ready karo aur Jupyter mein ek cell run karo.
:::

:::keypoints
### Key Takeaways — Day 1
- ML = data se patterns seekhna, explicit rules nahi likhne
- Supervised: labelled data → predict output
- Unsupervised: unlabelled data → find patterns
- Reinforcement: reward/penalty se seekhna
- Python + Jupyter = industry standard ML setup
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
### Pro Tip
Pehle data explore karo fully. \`df.head()\`, \`df.isnull().sum()\`, \`df.describe()\` — yeh 3 commands sabse pehle run karo. Data samjhe bina model mat banao.
:::

:::warning
### Important
GitHub pe CSV file mat daalo agar badi hai. \`.gitignore\` mein \`*.csv\` add karo. README mein Kaggle download link do.
:::

:::important
### R2 Score Guide
\`> 0.85\` = Excellent | \`0.70–0.85\` = Good | \`0.50–0.70\` = Okay | \`< 0.50\` = Improve karo | **Negative** = Model galat hai — features check karo
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
  concept: ':::concept\n### Your Concept Heading\nExplanation text here. **Bold** and *italic* supported.\n\nMultiple paragraphs work too — add line breaks.\n:::',
  image: ':::image\nurl: https://your-image-url.com/image.png\ncaption: Your image caption here\nalt: Alt text for accessibility\n:::',
  video: ':::video\nurl: https://youtube.com/watch?v=YOUR_ID\ntitle: Video Title Here\nmeta: YouTube · 10 min · Overview\nduration: 10:30\nrequired: true\n:::',
  code: ':::code python\n### Code Block Title\n# Your code here\nimport numpy as np\n\narr = np.array([1, 2, 3])\nprint(arr.mean())\n:::',
  'callout-tip': ':::tip\n### Pro Tip\nYour helpful tip text goes here. **Bold** and `inline code` supported.\n:::',
  'callout-warning': ':::warning\n### Warning\nImportant warning message here.\n:::',
  quiz: ':::quiz\nQ: Your question here?\nA: Option A text\nB: Option B text\nC: Option C text\nD: Option D text\nCORRECT: B\nEXPLAIN: Explanation of the correct answer here.\n:::',
  keypoints: ':::keypoints\n### Key Takeaways\n- First key point here\n- Second key point here\n- Third key point here\n- Fourth key point here\n:::',
  'task-hero': ':::task-hero\n# Task 1 —\n## House Price Predictor\nApply everything from Day 1–4: NumPy, Pandas, Matplotlib, Seaborn, Sklearn. Full ML project.\n- Estimated: 3–4 hours\n- Due: 11:59 PM Today\n- Max 2 attempts\n- Pass score: 60/100\n:::',
  requirements: ':::requirements\n### BEGINNER\n- pandas se CSV load karo\n- matplotlib se 2 charts banao\n- LinearRegression model train karo\n- R2 score print karo\n\n### INTERMEDIATE\n- Kaggle dataset use karo\n- Missing values handle karo\n- Seaborn heatmap banao\n- Cross-validation use karo\n\n### ADVANCED\n- 4 models compare karo\n- GridSearchCV use karo\n- Streamlit UI banao\n- Deploy karo\n:::'
};
