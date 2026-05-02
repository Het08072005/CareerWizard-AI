--
-- PostgreSQL database dump
--

\restrict MdnJRnAEbN1fPKbCmbNGawyQcfadFf4BmUEVCpwJCEq4eHH5NZFHJGWnLlE5RCP

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: domain_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domain_progress (
    id integer NOT NULL,
    user_id integer,
    domain character varying,
    progress_percentage integer
);


ALTER TABLE public.domain_progress OWNER TO postgres;

--
-- Name: domain_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.domain_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.domain_progress_id_seq OWNER TO postgres;

--
-- Name: domain_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.domain_progress_id_seq OWNED BY public.domain_progress.id;


--
-- Name: interview_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interview_questions (
    id integer NOT NULL,
    role character varying(100) NOT NULL,
    skills character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    title text NOT NULL,
    difficulty character varying(20) NOT NULL,
    tags character varying[],
    answer_explanation text NOT NULL,
    answer_code text
);


ALTER TABLE public.interview_questions OWNER TO postgres;

--
-- Name: interview_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interview_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interview_questions_id_seq OWNER TO postgres;

--
-- Name: interview_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interview_questions_id_seq OWNED BY public.interview_questions.id;


--
-- Name: job_skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_skill (
    job_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.job_skill OWNER TO postgres;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    company character varying(200) NOT NULL,
    location character varying(200),
    salary character varying(100),
    type character varying(50),
    description text,
    posted character varying(50)
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: resume_analyses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resume_analyses (
    id integer NOT NULL,
    filename character varying,
    text_content character varying,
    ats_score integer,
    strengths json,
    improvements json
);


ALTER TABLE public.resume_analyses OWNER TO postgres;

--
-- Name: resume_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resume_analyses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resume_analyses_id_seq OWNER TO postgres;

--
-- Name: resume_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resume_analyses_id_seq OWNED BY public.resume_analyses.id;


--
-- Name: resume_analysis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resume_analysis (
    id integer NOT NULL,
    filename character varying(255),
    text_content text,
    ats_score integer,
    strengths json,
    improvements json,
    parsed_skills json
);


ALTER TABLE public.resume_analysis OWNER TO postgres;

--
-- Name: resume_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resume_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resume_analysis_id_seq OWNER TO postgres;

--
-- Name: resume_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resume_analysis_id_seq OWNED BY public.resume_analysis.id;


--
-- Name: roadmaps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roadmaps (
    id integer NOT NULL,
    user_id integer,
    domain character varying,
    content json,
    progress json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.roadmaps OWNER TO postgres;

--
-- Name: roadmaps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roadmaps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roadmaps_id_seq OWNER TO postgres;

--
-- Name: roadmaps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roadmaps_id_seq OWNED BY public.roadmaps.id;


--
-- Name: skill_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_progress (
    id integer NOT NULL,
    user_id integer,
    role_key character varying,
    progress_data json,
    updated_at timestamp without time zone
);


ALTER TABLE public.skill_progress OWNER TO postgres;

--
-- Name: skill_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skill_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skill_progress_id_seq OWNER TO postgres;

--
-- Name: skill_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skill_progress_id_seq OWNED BY public.skill_progress.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_activities (
    id integer NOT NULL,
    user_id integer,
    activity_type character varying,
    details character varying,
    created_at timestamp without time zone
);


ALTER TABLE public.user_activities OWNER TO postgres;

--
-- Name: user_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_activities_id_seq OWNER TO postgres;

--
-- Name: user_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_activities_id_seq OWNED BY public.user_activities.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id integer,
    location character varying,
    linkedin_url character varying,
    bio text,
    experience text,
    skills text,
    target_roles text,
    resume_file_path character varying
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_profiles_id_seq OWNER TO postgres;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    id integer NOT NULL,
    user_id integer,
    question_id integer,
    is_completed boolean,
    is_bookmarked boolean,
    user_notes text,
    updated_at timestamp with time zone,
    ai_explanation text
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- Name: user_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_progress_id_seq OWNER TO postgres;

--
-- Name: user_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_progress_id_seq OWNED BY public.user_progress.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying,
    password character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: domain_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domain_progress ALTER COLUMN id SET DEFAULT nextval('public.domain_progress_id_seq'::regclass);


--
-- Name: interview_questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_questions ALTER COLUMN id SET DEFAULT nextval('public.interview_questions_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: resume_analyses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resume_analyses ALTER COLUMN id SET DEFAULT nextval('public.resume_analyses_id_seq'::regclass);


--
-- Name: resume_analysis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resume_analysis ALTER COLUMN id SET DEFAULT nextval('public.resume_analysis_id_seq'::regclass);


--
-- Name: roadmaps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roadmaps ALTER COLUMN id SET DEFAULT nextval('public.roadmaps_id_seq'::regclass);


--
-- Name: skill_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_progress ALTER COLUMN id SET DEFAULT nextval('public.skill_progress_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: user_activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activities ALTER COLUMN id SET DEFAULT nextval('public.user_activities_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: user_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress ALTER COLUMN id SET DEFAULT nextval('public.user_progress_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: domain_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.domain_progress (id, user_id, domain, progress_percentage) FROM stdin;
\.


--
-- Data for Name: interview_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interview_questions (id, role, skills, category, title, difficulty, tags, answer_explanation, answer_code) FROM stdin;
1	Frontend Developer	React, JavaScript	Fundamentals	Explain how React's virtual DOM works and why it improves performance.	medium	{React,DOM,Performance}	The **Virtual DOM (VDOM)** is a programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM. It's an object representation of the real DOM. When state changes, the VDOM is updated, a diffing algorithm compares the new VDOM with the previous one, and only the specific nodes that changed are patched into the real DOM. This minimizes direct manipulation of the slow real DOM.	// No code example needed for this theoretical question
2	Frontend Developer	JavaScript	Async	Write a polyfill for Promise.all()	hard	{JavaScript,Promises,Coding}	A `Promise.all` polyfill accepts an iterable of promises and returns a single promise that resolves when all of the promises in the iterable have resolved. It rejects if any of the promises reject.	\nfunction promiseAllPolyfill(promises) {\n    return new Promise((resolve, reject) => {\n        const results = [];\n        let resolvedCount = 0;\n\n        if (promises.length === 0) {\n            return resolve([]);\n        }\n\n        promises.forEach((promise, index) => {\n            Promise.resolve(promise).then(value => {\n                results[index] = value;\n                resolvedCount++;\n\n                if (resolvedCount === promises.length) {\n                    resolve(results);\n                }\n            }).catch(reject); // Short-circuit on first rejection\n        });\n    });\n}\n
3	Backend Developer	Python, Django, FastAPI	System Design	Design a URL shortener service like Bit.ly.	hard	{"System Design",Databases,Hashing}	A URL shortener requires components like a Hashing function (e.g., Base62 encoding) to generate short IDs, a database (like PostgreSQL/Cassandra) to store the mapping of short\\_ID -> long\\_URL, and a redirection service to handle the lookup and 301/307 redirect.	\N
4	Frontend Developer	React, JavaScript, CSS	Fundamentals	Explain how React's virtual DOM works. (1)	medium	{React,DOM,Performance}	The Virtual DOM is an in-memory representation of the real DOM, used by React to efficiently update the UI.	// No code needed
5	Frontend Developer	React, JavaScript, CSS	Fundamentals	What are React Hooks and why are they useful? (1)	medium	{React,Hooks}	Hooks allow functional components to manage state and side effects.	const [state, setState] = useState(0);
6	Frontend Developer	React, JavaScript, CSS	Fundamentals	Explain event delegation in JavaScript. (1)	medium	{JavaScript,Events}	Event delegation allows a single handler on a parent element to handle events for multiple child elements.	\N
237	Machine Learning Engineer (ML)	Python	Fundamentals	Difference between bias–variance tradeoff and how to detect/solve it.	medium	{Python,Fundamentals}	Bias refers to error from erroneous assumptions in the learning algorithm (underfitting), while variance is error from sensitivity to small fluctuations in the training set (overfitting). The tradeoff implies reducing one often increases the other; the goal is to find a balance for optimal generalization. Detect with learning curves or validation curves; solve via regularization, more data (for variance), simpler/complex models, or ensemble methods.	from sklearn.model_selection import learning_curve
238	Machine Learning Engineer (ML)	Python	Fundamentals	Explain regularization (L1 vs L2)—when to use which?	medium	{Python,Fundamentals}	Regularization prevents overfitting by adding a penalty to the loss function based on the magnitude of model coefficients. L1 (Lasso) adds an absolute value penalty (||w||1), promoting sparsity and performing implicit feature selection by driving some coefficients to zero. L2 (Ridge) adds a squared magnitude penalty (||w||2^2), shrinking coefficients towards zero but rarely to zero, effectively reducing their impact without removing features entirely. Use L1 when feature selection is crucial or many features are irrelevant; use L2 to simply reduce the impact of less important features and improve generalization.	from sklearn.linear_model import Lasso, Ridge
239	Machine Learning Engineer (ML)	Python	Fundamentals	How do you handle imbalanced datasets?	medium	{Python,Fundamentals}	Imbalanced datasets lead to models biased towards the majority class. Strategies include: resampling techniques like oversampling the minority class (e.g., SMOTE) or undersampling the majority class; using appropriate evaluation metrics like precision, recall, F1-score, or AUC-ROC instead of accuracy; cost-sensitive learning, which assigns higher penalties to misclassifying the minority class; and ensemble methods that can perform well on imbalanced data.	from imblearn.over_sampling import SMOTE
240	Machine Learning Engineer (ML)	Python	Fundamentals	What is cross-validation? Why is k=5 or k=10 common?	easy	{Python,Fundamentals}	Cross-validation is a resampling procedure used to evaluate machine learning models on a limited data sample. It involves partitioning the dataset into k equally sized folds, training the model on k-1 folds, and validating on the remaining fold, repeating this k times. k=5 or k=10 are common because they offer a good balance between bias and variance in performance estimation; higher k uses more data for training (lower bias) and provides more estimates (lower variance) but is computationally more expensive, while lower k is faster but can have higher bias and variance.	from sklearn.model_selection import KFold, cross_val_score
241	Machine Learning Engineer (ML)	Python	Fundamentals	Explain feature selection vs feature extraction.	medium	{Python,Fundamentals}	Feature selection involves choosing a subset of the original features based on their relevance and contribution to the model's performance, aiming to reduce dimensionality, remove noisy data, and improve interpretability (e.g., Recursive Feature Elimination, L1 regularization). Feature extraction, conversely, transforms the original features into a new, smaller set of features, often linear combinations of the originals, capturing the most important information while reducing dimensionality (e.g., PCA, LDA). Feature selection keeps original features, while extraction creates new ones.	from sklearn.decomposition import PCA\nfrom sklearn.feature_selection import SelectKBest
242	Deep Learning Engineer	Python	Fundamentals	What is gradient descent? How do variants differ (SGD, Adam, RMSProp)?	hard	{Python,Fundamentals}	Gradient Descent is an iterative optimization algorithm that minimizes a function by moving in the direction of the steepest descent, determined by the negative of the gradient. Variants differ in how they update weights: Stochastic Gradient Descent (SGD) uses a single training example per update, making it faster but noisier. RMSProp adapts the learning rate for each parameter by dividing it by an exponentially decaying average of squared gradients. Adam (Adaptive Moment Estimation) combines the advantages of RMSProp and momentum, using exponentially decaying averages of past gradients and squared gradients, making it generally robust and efficient for various deep learning tasks.	# Conceptual update rule for SGD:\n# W = W - learning_rate * dW_i
243	Machine Learning Engineer (ML)	Python	Fundamentals	Explain overfitting and methods to reduce it (ML + DL).	medium	{Python,Fundamentals}	Overfitting occurs when a model learns the training data and its noise too precisely, performing well on training data but poorly on unseen data due to high variance. To reduce it in ML: use more data, employ regularization (L1/L2), early stopping, cross-validation, and feature selection. For DL specifically, additional methods include dropout (randomly disabling neurons during training), batch normalization (normalizing layer inputs), and data augmentation (creating new training samples by transforming existing ones).	import tensorflow as tf\n# For DL:\n# model.add(tf.keras.layers.Dropout(0.3))
244	Generative AI Engineer (GenAI)	Python	Fundamentals	Difference between generative vs discriminative models.	medium	{Python,Fundamentals}	Generative models learn the joint probability distribution P(X, Y) of the data and its labels, enabling them to generate new data samples similar to the training data (e.g., GANs, VAEs). Discriminative models, on the other hand, directly learn the conditional probability P(Y|X) to classify or predict labels based on input features, focusing on finding decision boundaries without understanding the underlying data distribution (e.g., Logistic Regression, SVMs, standard Neural Networks).	
245	Machine Learning Engineer (ML)	Python	Fundamentals	What is ensemble learning? Explain Bagging vs Boosting vs Stacking.	hard	{Python,Fundamentals}	Ensemble learning combines multiple individual models (base learners) to achieve better predictive performance and robustness than any single model. Bagging (e.g., Random Forest) trains models independently on different bootstrapped subsets of data and averages their predictions to reduce variance. Boosting (e.g., AdaBoost, XGBoost) trains models sequentially, where each new model focuses on correcting the errors of previous ones, primarily reducing bias. Stacking trains a meta-model to learn how to best combine the predictions from several diverse base models, often leading to very high performance.	from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
246	Machine Learning Engineer (ML)	Python	Fundamentals	Why is XGBoost so powerful? Explain mathematically.	hard	{Python,Fundamentals}	XGBoost is powerful due to its optimized gradient boosting framework. Mathematically, it uses a second-order Taylor expansion of the loss function to include both first and second derivatives (gradient and Hessian), providing more precise steps towards the minimum compared to standard gradient boosting. It also incorporates regularization (L1 and L2) directly into the objective function to prevent overfitting, handles missing values, and supports parallel processing, making it robust and efficient.	# Objective function:\n# Obj = Sum(l(yi, F(xi))) + Sum(Omega(fk))\n# where Omega(fk) = gamma*T + lambda*||w||^2 + alpha*||w||_1 (regularization)
247	Machine Learning Engineer (ML)	Python	Fundamentals	How does decision tree splitting work (Gini, entropy)?	medium	{Python,Fundamentals}	Decision trees split nodes by selecting the feature and threshold that best separate the data into purer subsets, aiming to maximize information gain or minimize impurity. Gini impurity measures the probability of misclassifying a randomly chosen element from the set if it were randomly labeled according to the distribution of labels in the subset (lower is better). Entropy quantifies the disorder or uncertainty in a set of examples; the goal is to choose splits that result in the largest reduction in entropy, known as Information Gain.	from sklearn.tree import DecisionTreeClassifier\n# model = DecisionTreeClassifier(criterion='gini')
248	Machine Learning Engineer (ML)	Python	Fundamentals	Explain SVM kernel trick.	medium	{Python,Fundamentals}	The SVM kernel trick allows Support Vector Machines to efficiently classify non-linearly separable data by implicitly mapping it into a higher-dimensional feature space where it can become linearly separable, without explicitly computing the coordinates in that high-dimensional space. Kernel functions (e.g., RBF, polynomial, sigmoid) compute the dot product between transformed feature vectors in the higher dimension, drastically reducing computational cost and making complex decision boundaries feasible.	from sklearn.svm import SVC\n# model = SVC(kernel='rbf')
249	Data Scientist	Python	Fundamentals	What is curse of dimensionality?	easy	{Python,Fundamentals}	The curse of dimensionality refers to various problems that arise when analyzing and organizing data in high-dimensional spaces. As the number of features or dimensions increases, the data becomes increasingly sparse, making it exponentially harder to find meaningful patterns, compute distances, and leading to increased computational costs, higher risk of overfitting, and the need for significantly more data to maintain statistical significance.	
250	Machine Learning Engineer (ML)	Python	Fundamentals	Explain Maximum Likelihood Estimation and MAP estimation.	hard	{Python,Fundamentals}	Maximum Likelihood Estimation (MLE) finds the parameters that maximize the likelihood of observing the given data, assuming the data follows a specific probability distribution, focusing purely on the observed data. Maximum A Posteriori (MAP) estimation extends MLE by incorporating a prior probability distribution over the parameters, finding the parameters that maximize the posterior probability. MAP combines the data's likelihood with prior beliefs about the parameters, often leading to more stable estimates, especially with limited data, by penalizing extreme parameter values if the prior suggests they are unlikely.	# MLE: argmax(theta) P(Data | theta)\n# MAP: argmax(theta) P(theta | Data) = argmax(theta) P(Data | theta) * P(theta)
251	Machine Learning Engineer (ML)	Python	Fundamentals	What’s the difference between parametric and non-parametric models?	medium	{Python,Fundamentals}	Parametric models assume a fixed, finite number of parameters and a specific functional form for the relationship between input and output variables (e.g., Linear Regression assumes a linear relationship). They are simpler, faster, but less flexible. Non-parametric models, conversely, do not assume a fixed structure or number of parameters, allowing their complexity to grow with the data (e.g., K-Nearest Neighbors, Decision Trees, SVMs). They are more flexible and can capture complex relationships but often require more data and computation, and are prone to overfitting.	from sklearn.linear_model import LinearRegression # Parametric\nfrom sklearn.neighbors import KNeighborsRegressor # Non-parametric
290	Full Stack Developer	React	Fundamentals	Explain critical rendering path in the browser.	medium	{HTML,Fundamentals}	The Critical Rendering Path (CRP) is the sequence of steps a browser takes to convert HTML, CSS, and JavaScript into pixels on the screen. It involves constructing the DOM and CSSOM trees, combining them into a Render Tree, then performing Layout (reflow) and Paint (rasterization) to display content.	\N
49	Backend Developer	Python, Django, FastAPI	Fundamentals	Explain RESTful APIs and HTTP methods. (1)	medium	{Python,REST,API}	RESTful APIs use standard HTTP methods (GET, POST, PUT, DELETE) to interact with resources.	\N
50	Backend Developer	Python, Django, FastAPI	Coding	Write a Python function to check for prime numbers. (1)	medium	{Python,Algorithms}	Simple prime checking using a for loop.	def is_prime(n):\n  for i in range(2, n):\n    if n % i == 0:\n      return False\n  return True
252	Deep Learning Engineer	Python	Fundamentals	Explain backpropagation step-by-step.	medium	{Python,Fundamentals}	Backpropagation is an algorithm used to train artificial neural networks by calculating the gradient of the loss function with respect to the weights of the network. It involves a forward pass to compute the output and loss, followed by a backward pass that uses the chain rule to propagate the error gradient backward through the network, updating weights to minimize the loss.	\N
253	Deep Learning Engineer	Python	Fundamentals	Difference between CNN, RNN, LSTM, GRU.	medium	{Python,Fundamentals}	CNNs (Convolutional Neural Networks) excel at processing grid-like data like images by learning spatial hierarchies of features. RNNs (Recurrent Neural Networks) are designed for sequential data, processing one element at a time and maintaining internal state. LSTMs (Long Short-Term Memory) and GRUs (Gated Recurrent Units) are advanced RNN variants that solve the vanishing gradient problem in long sequences by using gating mechanisms to control information flow.	\N
254	Deep Learning Engineer	Python	Fundamentals	Why do we need positional embeddings in transformers?	medium	{Python,Fundamentals}	Transformers process input tokens in parallel, meaning they lack an inherent understanding of the sequence order. Positional embeddings inject information about the relative or absolute position of tokens within the sequence, allowing the model to distinguish between tokens based on their location and understand grammatical structure or temporal relationships.	\N
255	Deep Learning Engineer	Python	Fundamentals	Explain self-attention mathematically.	hard	{Python,Fundamentals}	Self-attention computes output for each input token by taking a weighted sum of all input tokens, where the weights are determined by a 'compatibility' function. Mathematically, it involves queries (Q), keys (K), and values (V) derived from input embeddings. The attention score is calculated as Softmax((Q * K^T) / sqrt(d_k)) * V, effectively weighting the 'value' representations based on their relevance to the 'query'.	\N
256	Deep Learning Engineer	Python	Fundamentals	What is multi-head attention?	medium	{Python,Fundamentals}	Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. It does this by independently running the self-attention mechanism multiple times ('heads') with different learned linear projections of Q, K, and V. The outputs from these heads are then concatenated and linearly projected back to the desired dimension.	\N
257	Deep Learning Engineer	Python	Fundamentals	Explain layer normalization vs batch normalization.	medium	{Python,Fundamentals}	Batch Normalization normalizes activations across the batch dimension for each feature, which is effective for training deep networks but sensitive to batch size. Layer Normalization, conversely, normalizes across the feature dimension for each individual sample, making it robust to varying sequence lengths and suitable for architectures like Transformers and RNNs where batch statistics can be unreliable.	\N
258	Deep Learning Engineer	Python	Fundamentals	What is vanishing/exploding gradients? How to fix them?	medium	{Python,Fundamentals}	Vanishing gradients occur when gradients become extremely small during backpropagation, preventing deep layers from learning, while exploding gradients occur when they become excessively large, leading to unstable training. Fixes include using ReLU activations, careful weight initialization (He, Xavier), gradient clipping (for exploding), residual connections, and specialized architectures like LSTMs/GRUs (for vanishing).	\N
259	Deep Learning Engineer	Python	Fundamentals	Why do transformer models scale better than RNNs?	medium	{Python,Fundamentals,"System Design"}	Transformers scale better due to their parallelizable self-attention mechanism, which allows processing all tokens simultaneously, unlike RNNs' sequential processing. This parallelism, combined with direct access to global context and reduced vanishing gradient issues over long sequences, enables efficient training on large datasets and distributed hardware, leading to superior performance on complex tasks.	\N
260	Deep Learning Engineer	Python	Fundamentals	Explain dropout and why it works (theory).	medium	{Python,Fundamentals}	Dropout is a regularization technique where a random subset of neurons are temporarily 'dropped out' (ignored) during training. This prevents neurons from co-adapting too much to specific features, forcing the network to learn more robust and redundant representations. Theoretically, it can be seen as training an ensemble of many thinned networks, which collectively lead to better generalization.	\N
261	Deep Learning Engineer	Python	Fundamentals	What are residual connections? Why are they important?	medium	{Python,Fundamentals}	Residual connections (skip connections) allow the input from a previous layer to be added directly to the output of a subsequent layer, bypassing one or more layers. They are crucial because they mitigate the vanishing gradient problem, enable the training of much deeper neural networks by facilitating gradient flow, and allow the network to learn 'residual' mappings which are often easier to optimize than direct mappings.	\N
291	Full Stack Developer	React	Fundamentals	What are Web Components and how do Shadow DOM, Custom Elements, Templates work?	medium	{HTML,Fundamentals}	Web Components are a set of W3C standards for creating reusable, encapsulated custom HTML tags. Custom Elements define new tags, Shadow DOM provides scoped styling and markup encapsulation, and HTML Templates (`<template>` and `<slot>`) define inert reusable markup structures.	\N
292	Full Stack Developer	React	Fundamentals	Difference between <script defer> vs <script async> — internal working?	medium	{HTML,JavaScript,Fundamentals}	`async` scripts are downloaded in parallel with HTML parsing and executed as soon as they're available, without blocking parsing. `defer` scripts are also downloaded in parallel but executed only after HTML parsing is complete, and crucially, in the order they appear in the document.	\N
293	Full Stack Developer	React	Fundamentals	How browser parses HTML? (Tokenization + Tree construction)	medium	{HTML,Fundamentals}	The browser parses HTML in two main phases: Tokenization, where it breaks the HTML input into tokens (e.g., `<html>`, `<body>`), and Tree Construction, where it builds the DOM tree from these tokens, adding elements and text nodes in a parent-child hierarchy.	\N
262	Generative AI Engineer (GenAI)	Python	Fundamentals	Difference between GPT, BERT, LLaMA, T5 architectures.	medium	{Python,Fundamentals}	GPT and LLaMA are decoder-only, generative models primarily used for text generation, pre-trained with a causal language modeling objective. BERT is an encoder-only model, pre-trained bidirectionally for understanding tasks like classification. T5 is an encoder-decoder model, framing all NLP tasks as text-to-text problems.	\N
263	Generative AI Engineer (GenAI)	Python	Fundamentals	What is tokenization? How does BPE work?	easy	{Python,Fundamentals}	Tokenization is the process of breaking down raw text into smaller units (tokens) for a model to process. Byte Pair Encoding (BPE) works by iteratively merging the most frequent adjacent byte pairs in a text corpus, creating new subword tokens until a predefined vocabulary size is reached or no more merges are beneficial.	Example: ['a', 'b', 'c', 'b', 'c', 'd'] -> Merge 'b', 'c' -> ['a', 'bc', 'bc', 'd']
264	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain causal vs bidirectional attention.	medium	{Python,Fundamentals}	Causal attention (used in decoder-only models like GPT) means a token can only attend to previous tokens in the sequence, making it suitable for generation. Bidirectional attention (used in encoder-only models like BERT) allows a token to attend to all other tokens (both past and future) in the sequence, ideal for understanding and context-rich tasks.	\N
265	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain pretraining → finetuning → RAG → SFT → RLHF.	hard	{Python,Fundamentals}	Pretraining involves training a large model on massive text data for general language understanding. Finetuning adapts this model to a specific task or dataset. Retrieval Augmented Generation (RAG) enhances generation by dynamically retrieving external information. Supervised Fine-Tuning (SFT) uses human-curated data to align model outputs. Reinforcement Learning from Human Feedback (RLHF) further aligns the model with human preferences using reinforcement learning.	\N
79	Frontend Developer	JavaScript, React	Async	Write a polyfill for Promise.all(). (1)	hard	{JavaScript,Promises,Async}	Promise.all polyfill accepts iterable of promises and resolves when all resolve.	\nfunction promiseAllPolyfill(promises) {\n  return new Promise((resolve, reject) => {\n    let results = [], count = 0;\n    promises.forEach((p, i) => Promise.resolve(p).then(v => {\n      results[i] = v;\n      count++;\n      if(count === promises.length) resolve(results);\n    }).catch(reject));\n  });\n}
266	Generative AI Engineer (GenAI)	Python	Fundamentals	What is LoRA? Why is it efficient?	medium	{Python,Fundamentals}	LoRA (Low-Rank Adaptation) is a parameter-efficient fine-tuning technique that injects small, trainable low-rank matrices into the attention layers of a pre-trained model. It's efficient because only these small matrices are updated during fine-tuning, drastically reducing the number of trainable parameters, memory footprint, and training time compared to full fine-tuning.	\N
267	Generative AI Engineer (GenAI)	Python	System Design	What are attention KV cache optimizations?	medium	{Python,Fundamentals,"System Design"}	KV cache optimizations involve storing the Key (K) and Value (V) tensors computed for previous tokens in the self-attention mechanism during autoregressive decoding. This prevents redundant recomputation of K and V for already-processed tokens, significantly speeding up inference latency and throughput, especially for long sequences.	\N
268	Generative AI Engineer (GenAI)	Python	System Design	Explain RAG pipeline design.	medium	{Python,"System Design"}	A RAG pipeline typically consists of an indexing phase (chunking documents, generating and storing embeddings in a vector database) and a retrieval phase. When a query arrives, relevant document chunks are retrieved from the vector database based on semantic similarity, then concatenated with the query and fed to an LLM for context-aware response generation.	\N
269	Generative AI Engineer (GenAI)	Python	Fundamentals	How do you evaluate LLMs? (BLEU, ROUGE, perplexity, human eval)	medium	{Python,Fundamentals}	LLM evaluation involves metrics like BLEU and ROUGE for n-gram overlap with reference texts, and perplexity for measuring the model's uncertainty in predicting the next token. However, human evaluation remains crucial for assessing subjective qualities like factual accuracy, coherence, helpfulness, and safety, which quantitative metrics often miss.	\N
270	Generative AI Engineer (GenAI)	Python	Fundamentals	What is model quantization (INT8, FP8, QLoRA)?	hard	{Python,Fundamentals}	Model quantization reduces the numerical precision of model weights and activations (e.g., from FP32 to INT8 or FP8) to reduce memory footprint and speed up inference. QLoRA combines 4-bit quantization with LoRA for efficient fine-tuning of large models, allowing for training with minimal memory while maintaining performance.	\N
271	Generative AI Engineer (GenAI)	Python	System Design	Memory/latency optimization strategies for LLM inference.	hard	{Python,"System Design"}	Key strategies include KV caching to avoid recomputing attention keys/values, model quantization (e.g., INT8/FP8) to reduce memory and computation, speculative decoding for faster generation, dynamic batching for maximizing GPU utilization, and distributed inference (model/pipeline parallelism) for handling large models across multiple devices.	\N
272	MLOps Engineer	Python	Fundamentals	Explain ML lifecycle: data → train → validate → deploy → monitor.	easy	{Python,Fundamentals}	The ML lifecycle starts with data collection and preparation, followed by model training. Validation assesses model performance and selects the best model. Deployment puts the model into production for inference, and continuous monitoring tracks its performance and detects drift, triggering retraining or updates as needed.	\N
273	MLOps Engineer	Python	System Design	How do you deploy ML models? (Docker, FastAPI, Kubernetes)	medium	{Python,"System Design",API}	ML models are typically deployed by encapsulating them with dependencies in Docker containers for portability. FastAPI is used to expose the model as a robust, high-performance REST API. Kubernetes then orchestrates these containers, managing scaling, load balancing, and high availability for the deployed services.	from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Input(BaseModel):\n    text: str\n\n@app.post("/predict")\nasync def predict(input: Input):\n    # Model inference logic here\n    return {"prediction": f"Predicted for {input.text}"}
89	Backend Developer	Python, Django, FastAPI	System Design	Design a URL shortener service like Bit.ly. (1)	hard	{"System Design",Databases,Hashing}	A URL shortener requires hashing, a database for mapping, and a redirect service.	\N
274	MLOps Engineer	Python	Fundamentals	What’s the difference between batch & real-time inference?	easy	{Python,Fundamentals}	Batch inference processes a large volume of data offline at scheduled intervals, suitable for non-urgent predictions where latency isn't critical. Real-time inference processes individual requests on-demand, requiring low latency and high availability, typically for user-facing applications.	\N
275	MLOps Engineer	Python	Fundamentals	Explain feature store & its role.	medium	{Python,Fundamentals,"System Design"}	A feature store is a centralized system for managing and serving machine learning features consistently across training and inference environments. Its role is to ensure feature consistency, enable feature reusability, and provide low-latency access to precomputed features, crucial for real-time model serving.	\N
276	MLOps Engineer	Python	Fundamentals	What is model drift & how do you detect it?	medium	{Python,Fundamentals}	Model drift refers to the degradation of a model's performance over time due to changes in the underlying data distribution (data drift or concept drift). It's detected by continuously monitoring input data statistics, model prediction distributions, and key performance metrics (e.g., accuracy, precision) against predefined thresholds or historical baselines.	\N
277	MLOps Engineer	Python	Fundamentals	What is A/B testing for ML systems?	medium	{Python,Fundamentals,"System Design"}	A/B testing for ML systems is an experimental method where different versions of a model or system (e.g., Model A vs. Model B) are presented to different user groups in a controlled environment. Key performance indicators (KPIs) are then measured to determine which version performs better against specific business objectives.	\N
99	Backend	Python, Flask, SQL	Coding	Explain the difference between a list and a tuple in Python.	medium	{Python,"Data Structures"}	A list is mutable, meaning its elements can be changed after creation, and is denoted by square brackets []. A tuple is immutable, meaning its elements cannot be changed, and is denoted by parentheses ().	list_example = [1, 2, 3]\\ntuple_example = (1, 2, 3)
100	Backend	Python, Flask, SQL	Coding	Explain the difference between a list and a tuple in Python.	medium	{Python,"Data Structures"}	A list is mutable, meaning its elements can be changed after creation, and is denoted by square brackets []. A tuple is immutable, meaning its elements cannot be changed, and is denoted by parentheses ().	list_example = [1, 2, 3]\\ntuple_example = (1, 2, 3)
101	Software Engineer	Python, Algorithms	Data Structures	Reverse a Linked List	Medium	{"Linked List",Recursion,Iteration}	To reverse a singly linked list, we can iterate through the list while reversing the next pointer of each node. We maintain three pointers: previous, current, and next. At the end, the previous pointer will be the new head of the reversed list.	class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_linked_list(head):\n    prev = None\n    current = head\n    while current:\n        next_node = current.next\n        current.next = prev\n        prev = current\n        current = next_node\n    return prev
102	Machine Learning Engineer (ML)	Python	Fundamentals	What is supervised learning?	easy	{Fundamentals}	Supervised learning is a type of machine learning where the model is trained on labeled data. This means that for each input example in the training dataset, there's a corresponding correct output (the 'label'). The goal of the model is to learn a mapping function from the input features to these output labels, enabling it to accurately predict outputs for new, unseen inputs. Common tasks include classification (predicting a categorical label) and regression (predicting a continuous value).	\N
103	Machine Learning Engineer (ML)	Python	Fundamentals	Explain overfitting in machine learning.	easy	{Fundamentals}	Overfitting occurs when a machine learning model learns the training data too well, including the noise and specific details of that data, rather than the underlying general patterns. This results in a model that performs exceptionally well on the training data but fails to generalize and performs poorly on new, unseen data. It's often characterized by high variance and low bias, meaning the model is too complex for the given data.	\N
104	Machine Learning Engineer (ML)	Python	Coding	Write a Python function to compute the accuracy of a model.	easy	{Python,Coding}	This Python function computes the accuracy of a classification model. Accuracy is defined as the proportion of correct predictions (where the predicted label matches the true label) out of the total number of predictions. It's a common evaluation metric for classification tasks, especially when classes are balanced. The function takes two lists or arrays: `y_true` (the actual labels) and `y_pred` (the model's predicted labels).	def compute_accuracy(y_true, y_pred):\n    if not y_true or not y_pred:\n        return 0.0 # Handle empty inputs or mismatched lengths gracefully\n    if len(y_true) != len(y_pred):\n        raise ValueError("Lengths of y_true and y_pred must be equal")\n\n    correct_predictions = sum(1 for true, pred in zip(y_true, y_pred) if true == pred)\n    return correct_predictions / len(y_true)
105	Machine Learning Engineer (ML)	Python	Fundamentals	What is a confusion matrix?	easy	{Fundamentals}	A confusion matrix is a table used to evaluate the performance of a classification model. It summarizes the number of correct and incorrect predictions made by the classifier, broken down by each class. It's particularly useful for understanding the types of errors a model is making, especially with imbalanced datasets. The matrix typically shows four key values:\n- **True Positives (TP):** Correctly predicted positive instances.\n- **False Positives (FP):** Incorrectly predicted positive instances (Type I error).\n- **True Negatives (TN):** Correctly predicted negative instances.\n- **False Negatives (FN):** Incorrectly predicted negative instances (Type II error).	\N
117	Machine Learning Engineer (ML)	Python	Fundamentals	Cross-Validation	medium	{Python,Fundamentals}	Cross-validation is a technique to assess a model's generalization ability by partitioning data into multiple folds, training on a subset, and testing on the remainder, rotating through all folds. It's crucial because it provides a more robust and less biased estimate of model performance than a single train-test split, helping to prevent overfitting and assess how the model will perform on unseen data.	\N
118	Data Scientist	Python	Fundamentals	Parametric vs. Non-Parametric Models	hard	{Python,Fundamentals}	Parametric models make explicit assumptions about the functional form of the relationship between variables, estimating a fixed number of parameters from data (e.g., linear regression). Non-parametric models do not make such strong assumptions about the underlying data distribution or functional form, learning directly from the data without being constrained by a fixed number of parameters, offering more flexibility but often requiring more data.	\N
106	Deep Learning Engineer	Python	Fundamentals	Describe the difference between CNN and RNN.	medium	{Fundamentals}	Convolutional Neural Networks (CNNs) and Recurrent Neural Networks (RNNs) are both powerful deep learning architectures, but they are fundamentally designed for different types of data and tasks:\n\n**CNNs (Convolutional Neural Networks):**\n-   **Primary Use Case:** Best suited for data with a known grid-like topology, such as images (2D grids of pixels) or video. They excel at identifying spatial hierarchies of features.\n-   **Mechanism:** Utilize convolutional layers, which apply filters to small receptive fields of the input data to extract local features. Pooling layers then downsample these feature maps. This architecture allows them to learn spatial invariances.\n-   **Key Characteristic:** Parameter sharing and sparse connectivity, making them efficient for high-dimensional inputs and effective at capturing local patterns.\n\n**RNNs (Recurrent Neural Networks):**\n-   **Primary Use Case:** Designed for sequential data where the order of elements is crucial, such as text, speech, time series, and natural language processing tasks.\n-   **Mechanism:** Have a 'memory' or an internal state that allows information to persist across different steps in a sequence. They process data sequentially, passing hidden state information from one step to the next, enabling them to capture temporal dependencies.\n-   **Key Characteristic:** Recurrent connections allow for the processing of variable-length sequences and modeling context over time. Variants like LSTMs and GRUs address the vanishing/exploding gradient problems inherent in basic RNNs.	\N
107	Machine Learning Engineer (ML)	Python	Fundamentals	Explain gradient descent.	medium	{Fundamentals}	Gradient descent is an iterative optimization algorithm used to find the minimum of a function, typically a cost or loss function in machine learning. The goal is to adjust the model's parameters (weights and biases) in such a way that the loss function is minimized, leading to a more accurate model.\n\n**How it works:**\n1.  **Initialization:** Start with random initial values for the model's parameters.\n2.  **Calculate Gradient:** At the current parameter values, compute the gradient of the loss function. The gradient is a vector that points in the direction of the steepest increase of the function.\n3.  **Update Parameters:** Move the parameters in the opposite direction of the gradient (i.e., towards the steepest decrease). The step size is controlled by a hyperparameter called the `learning rate`.\n    `New_parameters = Old_parameters - (learning_rate * gradient_of_loss)`\n4.  **Iteration:** Repeat steps 2 and 3 for a fixed number of iterations or until the change in the loss function or parameters falls below a certain threshold (convergence).\n\nVariations include Batch Gradient Descent (uses the entire dataset), Stochastic Gradient Descent (SGD, uses one sample), and Mini-Batch Gradient Descent (uses a small batch of samples), which balance computational efficiency and convergence stability.	\N
108	Machine Learning Engineer (ML)	Python	Fundamentals	What are hyperparameters?	easy	{Fundamentals}	Hyperparameters are external configuration variables for a machine learning model or algorithm whose values are set before the training process begins and are not learned from the data itself. They control the learning process and model structure. Examples include the learning rate in gradient descent, the number of layers or neurons in a neural network, the regularization strength (e.g., L1, L2), the number of trees in a random forest, or the kernel type in an SVM.\n\nIn contrast, model parameters (like weights and biases in a neural network) are internal variables that are learned by the model from the training data during the optimization process.	\N
109	Data Scientist	Python	System Design	Design a recommendation system.	hard	{"System Design"}	Designing a recommendation system involves understanding user preferences and item characteristics to suggest relevant items. A robust design considers data, algorithms, scalability, and evaluation.\n\n**1. Define Goals and Scope:**\n*   **Objective:** Increase user engagement, drive sales, improve content discovery, etc.\n*   **Domain:** E-commerce products, movies, news articles, music, etc.\n*   **Data Availability:** User-item interactions (ratings, clicks, purchases), item metadata, user demographics.\n\n**2. Data Pipeline & Storage:**\n*   **Data Sources:** User activity logs (clicks, views, purchases), item catalogs, user profiles.\n*   **Storage:** Distributed file systems (HDFS), data warehouses (Snowflake, BigQuery), NoSQL databases (Cassandra) for real-time features.\n*   **ETL/ELT:** Tools like Spark, Flink for cleaning, transforming, and aggregating data.\n\n**3. Recommendation Algorithms (Core Logic):**\n*   **A. Collaborative Filtering (CF):**\n    *   **User-Based CF:** Recommends items liked by users similar to the target user.\n    *   **Item-Based CF:** Recommends items similar to those the target user has liked in the past.\n    *   **Matrix Factorization (e.g., SVD, ALS):** Decomposes the user-item interaction matrix into lower-dimensional latent factors for users and items, effective for sparsity.\n*   **B. Content-Based Filtering:**\n    *   Recommends items similar to what the user has explicitly or implicitly liked, based on item attributes (e.g., genre, keywords).\n    *   Requires rich item metadata and uses similarity metrics (e.g., cosine similarity).\n*   **C. Hybrid Approaches:** Combine CF and content-based methods to leverage strengths and mitigate weaknesses (e.g., cold start).\n*   **D. Deep Learning Models:** Two-tower models (e.g., using TensorFlow Recommenders), Graph Neural Networks (GNNs), or sequence models (RNNs/Transformers) for capturing complex patterns.\n*   **E. Heuristics/Fallback:** Popularity-based, trending items, or new arrivals for cold-start users/items.\n\n**4. System Architecture (High-Level):**\n*   **Offline Processing Layer:** Periodically (e.g., daily) trains and updates recommendation models using historical data. This typically runs on distributed computing frameworks (Spark, Ray).\n*   **Online Serving Layer:** An API endpoint that receives real-time user requests. It fetches pre-computed recommendations or generates them on-the-fly (e.g., using a real-time feature store) and serves them with low latency. Could involve candidate generation followed by re-ranking.\n*   **Feature Store:** Centralized repository for consistent feature definitions and serving for both training and inference.\n*   **A/B Testing Framework:** Essential for continuously evaluating new recommendation algorithms and improvements in a controlled environment.\n\n**5. Addressing Key Challenges:**\n*   **Cold Start Problem:** New users or new items have no interaction data. Solutions include content-based recommendations, popularity-based lists, or asking users for initial preferences.\n*   **Sparsity:** Many users interact with only a tiny fraction of items. Matrix factorization and deep learning can handle this.\n*   **Scalability:** Handling millions of users/items and real-time requests. Requires distributed computing and optimized retrieval (e.g., approximate nearest neighbors).\n*   **Diversity & Serendipity:** Avoiding recommending only highly popular or overly similar items. Introducing a degree of randomness or using diverse recommendation sets.\n*   **Explainability:** Providing reasons for recommendations can increase user trust and engagement.\n*   **Bias:** Ensuring fairness and preventing amplification of biases present in the training data.\n\n**6. Evaluation Metrics:**\n*   **Offline Metrics:** Precision@K, Recall@K, NDCG (Normalized Discounted Cumulative Gain), MRR (Mean Reciprocal Rank), RMSE (for rating prediction tasks).\n*   **Online Metrics (A/B testing):** Click-Through Rate (CTR), Conversion Rate, average session duration, user retention, diversity, serendipity metrics.	\N
110	Machine Learning Engineer (ML)	Python	Fundamentals	What is the difference between supervised, unsupervised, and reinforcement learning?	medium	{Python,Fundamentals}	Supervised learning uses labeled data to predict outcomes, unsupervised learning finds hidden patterns and structures in unlabeled data, while reinforcement learning involves an agent learning optimal actions through trial and error by interacting with an environment to maximize rewards.	\N
111	Machine Learning Engineer (ML)	Python	Fundamentals	Explain bias vs. variance.	medium	{Python,Fundamentals}	Bias refers to the error introduced by approximating a real-world problem with a simplified model, leading to underfitting. Variance refers to the model's sensitivity to small fluctuations in the training data, leading to overfitting and poor generalization on unseen data.	\N
112	Machine Learning Engineer (ML)	Python	Fundamentals	What is overfitting and underfitting? How do you prevent them?	medium	{Python,Fundamentals}	Overfitting occurs when a model learns the training data too well, capturing noise and performing poorly on new data. Underfitting happens when a model is too simple to capture the underlying patterns, resulting in high errors on both training and test data. Prevention involves techniques like regularization (L1/L2), cross-validation, and getting more data for overfitting; and using more complex models or adding features for underfitting.	\N
113	Machine Learning Engineer (ML)	Python	Fundamentals	Overfitting and Underfitting	medium	{Python,Fundamentals}	Overfitting occurs when a model learns the training data and noise too well, failing to generalize to new data. Underfitting happens when a model is too simple to capture the underlying patterns, performing poorly on both training and test sets. Prevention includes regularization, cross-validation, gathering more data for overfitting, and increasing model complexity for underfitting.	\N
114	Machine Learning Engineer (ML)	Python	Fundamentals	Regularization: L1 vs L2	medium	{Python,Fundamentals}	Regularization prevents overfitting by adding a penalty to the loss function, encouraging simpler models. L1 (Lasso) regularization adds the absolute value of coefficients, leading to sparse models by driving some coefficients to zero (feature selection). L2 (Ridge) regularization adds the squared value of coefficients, shrinking them towards zero but rarely exactly zero, mitigating multicollinearity and reducing complexity.	\N
115	Data Scientist	Python	Fundamentals	Precision, Recall, and F1-score	medium	{Python,Fundamentals}	Precision measures the proportion of positive identifications that were truly correct (TP / (TP + FP)). Recall measures the proportion of actual positives that were correctly identified (TP / (TP + FN)). The F1-score is the harmonic mean of precision and recall, providing a balanced metric, especially useful for imbalanced datasets.	\N
116	Data Scientist	Python	Fundamentals	ROC-AUC	medium	{Python,Fundamentals}	The ROC (Receiver Operating Characteristic) curve plots the True Positive Rate against the False Positive Rate at various classification thresholds. AUC (Area Under the Curve) quantifies the overall performance, representing the probability that the model ranks a randomly chosen positive instance higher than a randomly chosen negative instance. A higher AUC indicates better discriminatory power across all thresholds.	\N
119	Machine Learning Engineer (ML)	Python	Fundamentals	Curse of Dimensionality	hard	{Python,Fundamentals}	The curse of dimensionality describes various phenomena that arise when analyzing and organizing data in high-dimensional spaces that do not occur in low dimensions. As the number of features increases, the data becomes extremely sparse, making it harder for models to find meaningful patterns, increasing computational cost, and requiring exponentially more data to achieve statistical significance, often leading to overfitting.	\N
120	Machine Learning Engineer (ML)	Python	Fundamentals	Feature Scaling: Normalization vs. Standardization	medium	{Python,Fundamentals}	Feature scaling adjusts the range of independent variables. Normalization (Min-Max Scaling) scales features to a fixed range, typically [0, 1], by subtracting the minimum and dividing by the range. Standardization (Z-score Scaling) transforms features to have a mean of 0 and a standard deviation of 1, by subtracting the mean and dividing by the standard deviation. Normalization is sensitive to outliers and good for algorithms expecting bounded inputs, while standardization is robust to outliers and preferred for algorithms assuming Gaussian distributions or sensitive to scale differences like SVMs or PCA.	\N
121	Machine Learning Engineer (ML)	Python	Fundamentals	Explain linear regression. How do you evaluate it?	medium	{Python,Fundamentals}	Linear regression is a supervised learning algorithm that models the linear relationship between a dependent variable and one or more independent variables, predicting continuous output values. It's evaluated using metrics like Mean Squared Error (MSE), R-squared, and Mean Absolute Error (MAE), which quantify the model's accuracy and fit.	\N
122	Machine Learning Engineer (ML)	Python	Fundamentals	Explain logistic regression. How is it different from linear regression?	medium	{Python,Fundamentals}	Logistic regression is a classification algorithm used for predicting binary outcomes, utilizing a sigmoid function to map predictions to probabilities between 0 and 1. Unlike linear regression which predicts continuous values directly, logistic regression models the probability of a categorical outcome, making it suitable for classification tasks.	\N
123	Machine Learning Engineer (ML)	Python	Fundamentals	Explain decision trees and how they work.	medium	{Python,Fundamentals}	Decision trees are non-parametric supervised learning algorithms that can be used for both classification and regression tasks. They work by recursively splitting the dataset into subsets based on feature values, creating a tree-like structure of decisions (nodes) and outcomes (leaves) that ultimately predict a target value.	\N
124	Machine Learning Engineer (ML)	Python	Fundamentals	What is a random forest? How does it prevent overfitting?	medium	{Python,Fundamentals}	A random forest is an ensemble learning method that builds multiple decision trees during training and outputs the mode of the classes (for classification) or mean prediction (for regression) of the individual trees. It prevents overfitting by introducing randomness through bagging (bootstrap aggregating) and feature sampling, which creates diverse trees whose aggregated predictions generalize better.	\N
125	Machine Learning Engineer (ML)	Python	Fundamentals	Explain gradient boosting (e.g., XGBoost, LightGBM).	hard	{Python,Fundamentals}	Gradient boosting is a powerful ensemble technique that builds models sequentially, where each new model corrects the errors of the previous ones, typically using decision trees. It minimizes a loss function by iteratively moving in the direction of the negative gradient, with implementations like XGBoost and LightGBM optimizing this process for speed and performance.	\N
126	Machine Learning Engineer (ML)	Python	Fundamentals	What is k-nearest neighbors (KNN)?	easy	{Python,Fundamentals}	K-Nearest Neighbors (KNN) is a non-parametric, lazy learning algorithm used for both classification and regression. It classifies a new data point based on the majority class (or average value for regression) of its 'k' closest neighbors in the feature space, making no explicit training phase but computing predictions on the fly.	\N
127	Machine Learning Engineer (ML)	Python	Fundamentals	Explain support vector machines (SVM) and kernel trick.	hard	{Python,Fundamentals}	Support Vector Machines (SVMs) are supervised learning models that find an optimal hyperplane to separate data into classes with the maximum margin. The kernel trick allows SVMs to handle non-linearly separable data by implicitly mapping it into a higher-dimensional space where a linear separation becomes possible, without computationally expensive explicit transformations.	\N
128	Machine Learning Engineer (ML)	Python	Fundamentals	Explain Naive Bayes classifier. When is it used?	medium	{Python,Fundamentals}	The Naive Bayes classifier is a probabilistic machine learning model based on Bayes' theorem with a 'naive' assumption of conditional independence among features. Due to its simplicity, speed, and efficiency with large datasets, it is commonly used in natural language processing tasks like text classification, spam detection, and sentiment analysis.	\N
129	Machine Learning Engineer (ML)	Python	Fundamentals	What is k-means clustering?	medium	{Python,Fundamentals}	K-means is an unsupervised learning algorithm that partitions 'n' observations into 'k' clusters, where each observation belongs to the cluster with the nearest mean (centroid). It iteratively assigns data points to the closest cluster centroid and then updates the centroids to be the mean of their assigned points, aiming to minimize within-cluster variance.	\N
130	Machine Learning Engineer (ML)	Python	Fundamentals	Explain hierarchical clustering.	medium	{Python,Fundamentals}	Hierarchical clustering is an unsupervised algorithm that builds a hierarchy of clusters, either by starting with individual data points and merging them (agglomerative/bottom-up) or starting with one large cluster and splitting it (divisive/top-down). The result is typically visualized as a dendrogram, which shows the nested grouping of clusters and their similarity.	\N
131	Machine Learning Engineer (ML)	Python	Fundamentals	Explain the architecture of a neural network.	easy	{Python,Fundamentals}	A neural network typically consists of an input layer, one or more hidden layers, and an output layer. Each layer contains interconnected 'neurons' that process information, with connections having associated weights and biases. Data flows forward, undergoing transformations via activation functions.	
132	Machine Learning Engineer (ML)	Python	Fundamentals	What is backpropagation?	medium	{Python,Fundamentals}	Backpropagation is an algorithm used to train neural networks by efficiently calculating the gradient of the loss function with respect to the network's weights. It propagates the error backward from the output layer through the hidden layers, using the chain rule to update weights and minimize loss.	
133	Machine Learning Engineer (ML)	Python	Fundamentals	What are activation functions? Examples?	easy	{Python,Fundamentals}	Activation functions introduce non-linearity into a neural network, allowing it to learn complex patterns and map non-linear relationships in data. Without them, a neural network would simply be a linear regression model. Common examples include ReLU, Sigmoid, and Tanh.	
134	Machine Learning Engineer (ML)	Python	Fundamentals	What is dropout, and why is it used?	medium	{Python,Fundamentals}	Dropout is a regularization technique that randomly sets a fraction of neurons to zero during training, preventing complex co-adaptations on the training data. This forces the network to learn more robust features and significantly reduces overfitting, improving generalization to unseen data.	
135	Deep Learning Engineer	Python	Fundamentals	Explain CNNs (Convolutional Neural Networks) and their applications.	medium	{Python,Fundamentals}	CNNs are specialized neural networks primarily for processing grid-like data like images, using convolutional layers to automatically learn spatial hierarchies of features. They excel in computer vision tasks such as image classification, object detection, and facial recognition, due to their ability to capture local patterns and translate invariance.	
136	Deep Learning Engineer	Python	Fundamentals	Explain RNNs (Recurrent Neural Networks) and LSTM/GRU.	medium	{Python,Fundamentals}	RNNs are neural networks designed for sequential data, where outputs from previous steps are fed as inputs to the current step, allowing them to model temporal dependencies. LSTMs and GRUs are types of RNNs that address the vanishing gradient problem by using gating mechanisms to control information flow, enabling them to learn long-term dependencies in sequences.	
137	Machine Learning Engineer (ML)	Python	Fundamentals	What is transfer learning?	easy	{Python,Fundamentals}	Transfer learning is a technique where a model trained on one task is re-purposed or fine-tuned for a second, related task. It leverages pre-trained models (e.g., on large image datasets like ImageNet) as a starting point, saving training time and data, especially useful when data for the target task is limited.	
138	Machine Learning Engineer (ML)	Python	Fundamentals	What is batch normalization?	medium	{Python,Fundamentals}	Batch normalization is a technique that normalizes the input to each layer in a neural network by re-centering and re-scaling it, typically across mini-batches during training. This stabilizes and accelerates training by reducing 'internal covariate shift,' allowing for higher learning rates and better generalization.	
139	Deep Learning Engineer	Python	Fundamentals	Explain gradient vanishing and exploding problems.	hard	{Python,Fundamentals}	Gradient vanishing occurs when gradients become extremely small during backpropagation, making it difficult for earlier layers to learn, especially in deep networks. Conversely, gradient exploding happens when gradients become excessively large, leading to unstable training and model divergence. Both hinder effective learning and are often addressed by techniques like LSTMs/GRUs, gradient clipping, or careful weight initialization.	
140	Deep Learning Engineer	Python	Fundamentals	What are autoencoders?	medium	{Python,Fundamentals}	Autoencoders are unsupervised neural networks designed to learn efficient data encodings (representations) in an unsupervised manner. They consist of an encoder that compresses input into a latent-space representation and a decoder that reconstructs the input from this representation, primarily used for dimensionality reduction, feature learning, and denoising.	
141	Machine Learning Engineer (ML)	Python	Fundamentals	Handling Imbalanced Datasets	medium	{Python,Fundamentals}	To handle imbalanced datasets, I employ techniques like oversampling the minority class (e.g., SMOTE), undersampling the majority class, or using algorithmic approaches such as `class_weight` in models. Additionally, I focus on appropriate evaluation metrics like precision, recall, F1-score, and ROC AUC, which provide a more accurate picture than accuracy alone.	\N
142	Machine Learning Engineer (ML)	Python	Fundamentals	Understanding the Confusion Matrix	easy	{Python,Fundamentals}	A confusion matrix is a table that summarizes the performance of a classification model, illustrating the count of true positives, true negatives, false positives, and false negatives. It provides a detailed breakdown of correct and incorrect predictions, helping to understand the types of errors a model makes.	\N
143	Machine Learning Engineer (ML)	Python	Fundamentals	Explaining ROC and Precision-Recall Curves	medium	{Python,Fundamentals}	The ROC (Receiver Operating Characteristic) curve plots the True Positive Rate against the False Positive Rate across various threshold settings, useful for balanced datasets. The Precision-Recall curve, which plots precision against recall, is more informative for imbalanced datasets as it highlights performance on the positive class and is less influenced by true negatives.	\N
144	Machine Learning Engineer (ML)	Python	Fundamentals	Choosing Evaluation Metrics for Regression vs Classification	medium	{Python,Fundamentals}	For **classification**, I choose metrics like accuracy, precision, recall, F1-score, and ROC AUC, considering class imbalance and the cost of different error types. For **regression**, common metrics include Mean Squared Error (MSE), Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), and R-squared to quantify prediction error and model fit.	\N
145	Machine Learning Engineer (ML)	Python	Fundamentals	A/B Testing and its Significance in ML	easy	{Python,Fundamentals}	A/B testing is a statistical method to compare two versions of a model or feature by exposing them to different user segments and measuring their performance. In ML, it's crucial for validating new model deployments, assessing the real-world impact of changes, and ensuring improvements before full rollout, mitigating risks and guiding data-driven decisions.	\N
146	Machine Learning Engineer (ML)	Python	Fundamentals	What is One-Hot Encoding?	easy	{Python,Fundamentals}	One-hot encoding is a technique to convert categorical variables into a numerical format suitable for machine learning algorithms. Each category is transformed into a binary vector, where a '1' indicates the presence of that category and '0's elsewhere, avoiding ordinal relationships. Libraries like pandas `get_dummies` or sklearn `OneHotEncoder` are commonly used.	\N
147	Machine Learning Engineer (ML)	Python	Fundamentals	Handling Missing Data	medium	{Python,Fundamentals}	I handle missing data primarily through imputation (e.g., mean, median, mode, or more advanced methods like K-NN imputation or regression imputation) or deletion of rows/columns if the missingness is minimal or the data is not vital. The choice depends on the missingness pattern, amount of missing data, and the specific dataset characteristics.	\N
148	Machine Learning Engineer (ML)	Python	Fundamentals	What is Feature Selection?	easy	{Python,Fundamentals}	Feature selection is the process of choosing a subset of relevant features from the original dataset for model training. Its primary goals are to reduce dimensionality, improve model performance by reducing overfitting, decrease training time, and enhance model interpretability by eliminating redundant or irrelevant features.	\N
149	Machine Learning Engineer (ML)	Python	Fundamentals	Explaining PCA (Principal Component Analysis)	medium	{Python,Fundamentals}	PCA (Principal Component Analysis) is a dimensionality reduction technique that transforms data into a new set of linearly uncorrelated variables called principal components. It identifies directions of maximum variance in the data, allowing projection onto a lower-dimensional space while retaining most of the crucial information.	\N
150	Machine Learning Engineer (ML)	Python	Fundamentals	What are Embeddings in Machine Learning?	medium	{Python,Fundamentals}	Embeddings are low-dimensional, dense vector representations of discrete variables (like words, users, or items) in a continuous vector space. They capture semantic relationships and context, allowing ML models to process complex data efficiently by representing similar items as vectors that are close to each other in this space.	\N
151	Machine Learning Engineer (ML)	Python	Fundamentals	Explain reinforcement learning and its key components.	medium	{Python,Fundamentals}	Reinforcement learning is a type of machine learning where an agent learns to make decisions by interacting with an environment to maximize a cumulative reward. Key components include the agent (learner), environment (the world), state (current situation), action (agent's move), reward (feedback), policy (strategy to choose actions), and value function (expected future reward).	\N
152	Generative AI Engineer (GenAI)	Python	Fundamentals	What are generative models (e.g., GANs)?	medium	{Python,Fundamentals}	Generative models are a class of AI models that learn to create new data instances that resemble the training data. Generative Adversarial Networks (GANs) consist of a generator (creates data) and a discriminator (distinguishes real from fake data), which are trained adversarially against each other to produce highly realistic outputs.	\N
153	Deep Learning Engineer	Python	Fundamentals	Explain attention mechanism and transformers.	hard	{Python,Fundamentals}	The attention mechanism allows a neural network to selectively focus on relevant parts of its input when processing sequences, assigning different weights to different parts. Transformers are a deep learning architecture primarily using self-attention mechanisms, processing input sequences in parallel, making them highly efficient and effective for tasks like machine translation and natural language understanding.	\N
154	Deep Learning Engineer	Python	Fundamentals	What is sequence-to-sequence modeling?	medium	{Python,Fundamentals}	Sequence-to-sequence (seq2seq) modeling is an architecture designed to transform an input sequence into an output sequence, typically using an encoder-decoder framework. The encoder processes the input sequence into a context vector, and the decoder then generates the output sequence based on this context, commonly used in machine translation, text summarization, and chatbots.	\N
155	Deep Learning Engineer	Python	Fundamentals	Explain word2vec and BERT embeddings.	hard	{Python,Fundamentals}	Word2vec generates static word embeddings by learning continuous vector representations of words based on their context, where similar words have similar vectors. BERT (Bidirectional Encoder Representations from Transformers) provides contextual embeddings, meaning a word's vector changes based on its surrounding words in a sentence, offering more nuanced semantic understanding by leveraging a transformer architecture.	\N
156	Machine Learning Engineer (ML)	Python	Fundamentals	What is ensemble learning? Give examples.	medium	{Python,Fundamentals}	Ensemble learning combines predictions from multiple individual models to achieve better performance than any single model alone, by reducing variance and bias. Common examples include Random Forests, which use bagging (bootstrap aggregating) of decision trees, and Gradient Boosting Machines (like XGBoost or LightGBM), which use boosting to sequentially build models correcting errors of previous ones.	\N
157	Machine Learning Engineer (ML)	Python	Fundamentals	Explain online learning vs batch learning.	easy	{Python,Fundamentals}	Batch learning involves training a model on the entire dataset at once, updating its parameters after processing all instances, which is computationally intensive but stable. Online learning, conversely, updates the model incrementally with each new data instance or small mini-batch, making it suitable for streaming data and scenarios where models need to adapt quickly.	\N
158	MLOps Engineer	Python	System Design	How do you deploy ML models in production?	hard	{"System Design",Python,API}	Deploying ML models typically involves containerizing the model (e.g., Docker) along with its dependencies, exposing it via a REST API (e.g., Flask, FastAPI), and then orchestrating deployment using tools like Kubernetes. This setup allows for scalability, monitoring performance, managing model versions, and continuous integration/delivery (CI/CD) to ensure reliable inference in production.	\N
159	AI Engineer	Python	Fundamentals	What are ethical issues in AI/ML?	medium	{Fundamentals}	Ethical issues in AI/ML include algorithmic bias (models perpetuating or amplifying societal prejudices), lack of transparency (black-box models), privacy concerns (misuse of personal data), accountability (who is responsible for AI errors), and job displacement due to automation. Addressing these requires careful data governance, explainability, and human oversight.	\N
160	Machine Learning Engineer (ML)	Python	Fundamentals	Explain explainable AI (XAI) and SHAP/ LIME.	medium	{Python,Fundamentals}	Explainable AI (XAI) focuses on making AI model predictions understandable to humans, addressing issues of transparency and trust. SHAP (SHapley Additive exPlanations) is a game theory-based method that assigns an importance value to each feature for a particular prediction. LIME (Local Interpretable Model-agnostic Explanations) approximates the behavior of any black-box model locally by training an interpretable surrogate model on perturbed samples.	\N
161	Data Scientist	Python	Fundamentals	Explain explainable AI (XAI) and SHAP/LIME.	medium	{Python,Fundamentals}	Explainable AI (XAI) aims to make machine learning models more transparent and interpretable, allowing humans to understand their predictions. SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations) are popular XAI techniques that provide insights into individual predictions by attributing the contribution of each feature, with SHAP offering a more theoretically grounded approach.	\N
162	Machine Learning Engineer (ML)	Python	Fundamentals	Explain Supervised, Unsupervised, and Reinforcement Learning.	easy	{Python,Fundamentals}	Supervised learning uses labeled datasets to train models for prediction (e.g., classification, regression). Unsupervised learning discovers patterns or structures in unlabeled data (e.g., clustering, dimensionality reduction). Reinforcement learning trains an agent to make sequential decisions in an environment through trial and error, maximizing cumulative rewards.	\N
163	Machine Learning Engineer (ML)	Python	Fundamentals	Differentiate Between Bias and Variance in Machine Learning.	medium	{Python,Fundamentals}	Bias refers to the error from overly simplistic assumptions in the model, leading to underfitting. Variance refers to the error from a model's excessive sensitivity to small fluctuations in the training data, leading to overfitting. The goal in model building is to achieve an optimal bias-variance trade-off for good generalization.	\N
164	Machine Learning Engineer (ML)	Python	Fundamentals	Define Overfitting and Underfitting, and Discuss Prevention Strategies.	medium	{Python,Fundamentals}	Overfitting occurs when a model learns the training data too well, capturing noise and failing to generalize to new data. Underfitting happens when a model is too simple to capture the underlying patterns in the data. Overfitting can be prevented using regularization, cross-validation, early stopping, or more data, while underfitting can be addressed by using more complex models, adding more features, or reducing regularization.	\N
165	Machine Learning Engineer (ML)	Python	Fundamentals	Explain L1 and L2 Regularization.	medium	{Python,Fundamentals}	L1 (Lasso) regularization adds the absolute value of coefficients to the loss function, promoting sparsity and effectively performing feature selection by shrinking some coefficients to zero. L2 (Ridge) regularization adds the squared value of coefficients, shrinking them towards zero but rarely to absolute zero, which helps prevent multicollinearity and generally leads to smoother models.	\N
166	Machine Learning Engineer (ML)	Python	Fundamentals	What are Precision, Recall, and F1-score?	medium	{Python,Fundamentals}	Precision measures the proportion of true positive predictions among all positive predictions, indicating how accurate positive predictions are. Recall (sensitivity) measures the proportion of true positives among all actual positives, indicating the model's ability to find all positive instances. F1-score is the harmonic mean of precision and recall, providing a balanced metric, especially useful for imbalanced datasets.	from sklearn.metrics import precision_score, recall_score, f1_score\ny_true = [0, 1, 0, 1, 1]\ny_pred = [0, 0, 0, 1, 1]\nprint(f"Precision: {precision_score(y_true, y_pred)}")\nprint(f"Recall: {recall_score(y_true, y_pred)}")\nprint(f"F1-score: {f1_score(y_true, y_pred)}")
167	Machine Learning Engineer (ML)	Python	Fundamentals	What is ROC-AUC?	medium	{Python,Fundamentals}	The ROC (Receiver Operating Characteristic) curve plots the True Positive Rate (Recall) against the False Positive Rate at various classification thresholds. The AUC (Area Under the Curve) measures the entire 2D area beneath the ROC curve, representing the model's ability to distinguish between classes across all possible thresholds, with a value closer to 1 indicating better performance.	from sklearn.metrics import roc_curve, auc\ny_true = [0, 1, 0, 1, 0]\ny_scores = [0.1, 0.8, 0.3, 0.9, 0.2]\nfpr, tpr, _ = roc_curve(y_true, y_scores)\nroc_auc = auc(fpr, tpr)\nprint(f"ROC AUC: {roc_auc:.2f}")
168	Machine Learning Engineer (ML)	Python	Fundamentals	Explain Cross-Validation and Its Types.	medium	{Python,Fundamentals}	Cross-validation is a robust technique to assess how a model's results will generalize to an independent dataset, preventing overfitting and providing a more reliable estimate of model performance. The most common type is K-Fold cross-validation, where the data is split into K equal-sized folds, and the model is trained K times, each time using K-1 folds for training and one fold for validation.	from sklearn.model_selection import KFold\nimport numpy as np\nX = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])\ny = np.array([0, 1, 0, 1])\nkf = KFold(n_splits=2, shuffle=True, random_state=42)\nfor train_index, test_index in kf.split(X):\n    # print(f"Train indices: {train_index}, Test indices: {test_index}")\n    # X_train, X_test = X[train_index], X[test_index]\n    # y_train, y_test = y[train_index], y[test_index]\n    pass # Model training and evaluation logic goes here
169	Machine Learning Engineer (ML)	Python	Fundamentals	Distinguish Between Parametric and Non-Parametric Models.	medium	{Python,Fundamentals}	Parametric models assume a fixed number of parameters and a specific functional form for the underlying data distribution (e.g., linear regression assumes linearity), making them simpler and faster but potentially less flexible. Non-parametric models do not make strong assumptions about the data distribution or functional form, allowing them to be more flexible and capture complex relationships but often requiring more data and computational resources (e.g., Decision Trees, K-Nearest Neighbors).	\N
170	Machine Learning Engineer (ML)	Python	Fundamentals	Explain the Curse of Dimensionality.	medium	{Python,Fundamentals}	The curse of dimensionality refers to various phenomena that arise when analyzing and organizing data in high-dimensional spaces. As the number of features (dimensions) increases, the data becomes extremely sparse, making it harder to find meaningful patterns, leading to increased computational cost, higher risk of overfitting, and the need for exponentially more data to maintain statistical significance for robust model training.	\N
171	Machine Learning Engineer (ML)	Python	Fundamentals	Describe Feature Scaling: Normalization vs. Standardization.	easy	{Python,Fundamentals}	Feature scaling adjusts the range of independent variables to a standard scale, crucial for algorithms sensitive to feature magnitudes. Normalization (Min-Max scaling) scales features to a fixed range, typically [0, 1], useful when the data distribution is not Gaussian. Standardization (Z-score normalization) transforms data to have zero mean and unit variance, making it suitable for algorithms that assume a Gaussian distribution or are sensitive to feature scales, like SVMs or K-Means.	from sklearn.preprocessing import MinMaxScaler, StandardScaler\nimport numpy as np\ndata = np.array([[10], [20], [30], [5], [25]])\n\nscaler_norm = MinMaxScaler()\nscaled_norm = scaler_norm.fit_transform(data) # Scales to [0,1]\nprint(f"Normalized data:\\n{scaled_norm}")\n\nscaler_std = StandardScaler()\nscaled_std = scaler_std.fit_transform(data) # Scales to mean=0, std=1\nprint(f"Standardized data:\\n{scaled_std}")
193	Backend Developer	Python	System Design	Describe the core services for a ride-sharing platform like Uber.	hard	{"System Design",API,Async,Python}	Core services include User/Driver Management, a Real-time Location Tracking service, a Matching Engine, a Dispatch System, Payment Gateway Integration, and a Notification Service. Geospatial databases and messaging queues are critical for handling real-time data and asynchronous operations.	\N
172	Machine Learning Engineer (ML)	Python	Fundamentals	Explain linear regression and its assumptions.	easy	{Python,Fundamentals}	Linear regression is a supervised learning algorithm for predicting a continuous target variable by modeling a linear relationship between input features and the target. Its key assumptions include linearity, independence of errors, homoscedasticity, normality of residuals, and no multicollinearity, which ensure the reliability of the model's estimates.	from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)
173	Machine Learning Engineer (ML)	Python	Fundamentals	Explain logistic regression and its use case.	easy	{Python,Fundamentals}	Logistic regression is a classification algorithm used to predict the probability of a binary outcome. It models the log-odds of the outcome as a linear combination of predictors, then uses the sigmoid function to map these probabilities to a range between 0 and 1, making it ideal for binary classification tasks like spam detection or disease prediction.	from sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)
174	Machine Learning Engineer (ML)	Python	Fundamentals	What is decision tree? How does it work?	medium	{Python,Fundamentals}	A decision tree is a non-parametric supervised learning algorithm used for both classification and regression. It works by recursively partitioning the data into subsets based on feature values, forming a tree-like model where internal nodes represent tests on attributes, branches are outcomes, and leaf nodes hold class labels or continuous values, facilitating interpretable decision-making.	from sklearn.tree import DecisionTreeClassifier\nmodel = DecisionTreeClassifier()\nmodel.fit(X_train, y_train)
175	Machine Learning Engineer (ML)	Python	Fundamentals	What is random forest and why it prevents overfitting?	medium	{Python,Fundamentals}	Random Forest is an ensemble learning method that builds multiple decision trees during training and outputs the mode/mean of their predictions. It prevents overfitting through bootstrap aggregation (bagging), which trains each tree on a random subset of data, and feature randomness, where each split considers only a random subset of features. This decorrelates the trees, reducing variance and improving generalization.	from sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)
176	Machine Learning Engineer (ML)	Python	Fundamentals	Explain gradient boosting, AdaBoost, XGBoost.	hard	{Python,Fundamentals}	Gradient Boosting is an ensemble technique building models sequentially, each correcting errors of predecessors by fitting to the negative gradient of the loss. AdaBoost (Adaptive Boosting) is an early variant that weights misclassified samples more heavily for subsequent learners. XGBoost (Extreme Gradient Boosting) is an optimized, scalable gradient boosting library known for its speed and performance due to regularization, parallel processing, and handling missing values, making it highly effective for complex datasets.	import xgboost as xgb\nmodel = xgb.XGBClassifier()\nmodel.fit(X_train, y_train)
177	Machine Learning Engineer (ML)	Python	Fundamentals	Explain Naive Bayes classifier and its assumptions.	medium	{Python,Fundamentals}	The Naive Bayes classifier is a probabilistic algorithm based on Bayes' Theorem, primarily used for classification. It assumes strong (naive) independence between features given the class, meaning each feature contributes independently to the probability of a class. This simplification makes it computationally efficient and effective, especially for text classification, despite the often unrealistic independence assumption.	from sklearn.naive_bayes import GaussianNB\nmodel = GaussianNB()\nmodel.fit(X_train, y_train)
178	Machine Learning Engineer (ML)	Python	Fundamentals	Explain k-means clustering.	easy	{Python,Fundamentals}	K-Means clustering is an unsupervised learning algorithm that partitions 'n' data points into 'k' clusters, where each data point belongs to the cluster with the nearest mean (centroid). It iteratively assigns points to clusters and updates centroids until convergence, minimizing the within-cluster sum of squares to group similar data points together.	from sklearn.cluster import KMeans\nmodel = KMeans(n_clusters=3, random_state=0)\nmodel.fit(X)
179	Deep Learning Engineer	Python	Fundamentals	Explain activation functions (ReLU, Sigmoid, Tanh).	medium	{Python,Fundamentals}	Activation functions introduce non-linearity, enabling neural networks to learn complex patterns. ReLU (Rectified Linear Unit) outputs `max(0, x)`, offering computational efficiency and mitigating vanishing gradients. Sigmoid (`1 / (1 + e^-x)`) squashes values between 0 and 1, suitable for binary classification outputs but prone to vanishing gradients. Tanh (`(e^x - e^-x) / (e^x + e^-x)`) squashes values between -1 and 1, centering outputs around zero which can aid optimization but also faces vanishing gradients.	import numpy as np\nrelu = lambda x: np.maximum(0, x)\nsigmoid = lambda x: 1 / (1 + np.exp(-x))\ntanh = lambda x: np.tanh(x)
180	Deep Learning Engineer	Python	Fundamentals	What is dropout and why is it used?	medium	{Python,Fundamentals}	Dropout is a regularization technique used in neural networks to prevent overfitting. During training, it randomly sets a fraction of neuron outputs to zero at each update, effectively 'dropping out' units. This forces the network to learn more robust features that are not reliant on specific neurons, making it less sensitive to the specific weights of individual neurons and improving generalization to unseen data.	import tensorflow as tf\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Dense(128, activation='relu'),\n    tf.keras.layers.Dropout(0.5),\n    tf.keras.layers.Dense(10, activation='softmax')\n])
181	Computer Vision Engineer	Python	Fundamentals	Explain convolutional neural networks (CNN) and their applications.	hard	{Python,Fundamentals}	Convolutional Neural Networks (CNNs) are specialized deep learning architectures excelling at processing grid-like data such as images. They use convolutional layers with learnable filters to detect local features, pooling layers for dimensionality reduction, and fully connected layers for classification. CNNs are fundamental in computer vision applications like image classification, object detection, facial recognition, and medical image analysis due to their ability to automatically learn hierarchical spatial features.	import tensorflow as tf\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),\n    tf.keras.layers.MaxPooling2D((2,2)),\n    tf.keras.layers.Flatten(),\n    tf.keras.layers.Dense(10, activation='softmax')\n])
194	Backend Developer	Python	System Design	How do you handle real-time driver and rider location updates efficiently in Python?	medium	{"System Design",Async,Python}	Use WebSockets for real-time location streaming from mobile clients to a Python backend. Process updates via a stream processing system (e.g., Kafka or Flink) and store/query location data using a geospatial database (e.g., PostGIS with PostgreSQL or MongoDB with geospatial indexing) for efficient nearest-neighbor searches.	\N
182	Deep Learning Engineer	Python	Fundamentals	Explain recurrent neural networks (RNN) and LSTM/GRU.	hard	{Python,Fundamentals}	Recurrent Neural Networks (RNNs) are designed for sequential data, using recurrent connections to pass information from previous steps, enabling memory. However, vanilla RNNs struggle with long-term dependencies due to vanishing/exploding gradients. LSTMs (Long Short-Term Memory) and GRUs (Gated Recurrent Units) address this with internal 'gates' that regulate information flow, allowing them to capture long-range dependencies effectively for tasks like NLP, speech recognition, and time series prediction by selectively remembering or forgetting information.	import tensorflow as tf\nmodel = tf.keras.Sequential([\n    tf.keras.layers.LSTM(128, input_shape=(timesteps, features)),\n    tf.keras.layers.Dense(1, activation='sigmoid')\n])
183	Deep Learning Engineer	Python	Fundamentals	What is transfer learning and its advantages?	medium	{Python,Fundamentals}	Transfer learning is a machine learning technique where a model pre-trained on a large dataset for one task is reused as a starting point for a new, related task. Its advantages include significantly reduced training time and computational cost, improved performance and generalization, especially with small datasets, and overcoming the need for massive amounts of labeled data by leveraging powerful pre-learned features.	from tensorflow.keras.applications import VGG16\nbase_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))\nmodel = tf.keras.Sequential([base_model, tf.keras.layers.Flatten(), tf.keras.layers.Dense(num_classes, activation='softmax')])
184	Backend Developer	Python	System Design	Describe the high-level architecture of a URL shortening service.	hard	{"System Design",API,Python}	A URL shortening service architecture typically involves an API Gateway, a Load Balancer, a Short URL Generator service, a distributed database (e.g., Cassandra or Redis for mappings), and a Caching layer. Requests for shortening come through the API, the generator creates a unique short code, and the mapping is stored. Redirection requests hit the cache first for speed.	\N
185	Backend Developer	Python	Coding	How would you generate unique, short URLs (e.g., 6 characters long) using Python?	medium	{Python,Coding,Fundamentals}	Generate unique short URLs by encoding a unique ID (e.g., an auto-incrementing database ID) into a base62 string (a-z, A-Z, 0-9). This ensures uniqueness and allows for a compact representation. A collision-check mechanism (e.g., using a hash and verifying database existence) could also be used for randomly generated codes.	import hashlib\nimport base62\n\ndef generate_short_url(long_url):\n    # Using a simple hash for demonstration, real systems would use unique IDs\n    hash_value = hashlib.md5(long_url.encode()).hexdigest()[:8]\n    short_code = base62.encode(int(hash_value, 16)) # Convert hex to int for base62\n    return short_code[:6] # Ensure 6 characters
186	Frontend Developer	React	Fundamentals	How would you handle user input for a long URL and display the short URL in a React application?	easy	{React,JavaScript,API}	Utilize React's `useState` hook for a controlled input component to capture the long URL. On form submission, make an asynchronous API call (e.g., using `fetch` or `axios`) to the backend. Display the received short URL using another state variable, updating the UI dynamically.	import React, { useState } from 'react';\n\nfunction URLShortener() {\n  const [longUrl, setLongUrl] = useState('');\n  const [shortUrl, setShortUrl] = useState('');\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    // Assume /api/shorten is your backend endpoint\n    const response = await fetch('/api/shorten', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ longUrl }),\n    });\n    const data = await response.json();\n    setShortUrl(data.shortUrl);\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input type="text" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} placeholder="Enter long URL" />\n      <button type="submit">Shorten</button>\n      {shortUrl && <p>Short URL: <a href={shortUrl}>{shortUrl}</a></p>}\n    </form>\n  );\n}
187	Backend Developer	Python	System Design	Outline the core components of a scalable chat application architecture.	hard	{"System Design",API,Async,Python}	A scalable chat app needs WebSocket servers for real-time messaging, a message queue (e.g., Kafka) for asynchronous delivery and persistence, a distributed database (e.g., Cassandra) for message history, a presence service, and a push notification service for offline users. Load balancers and service discovery are crucial for horizontal scaling.	\N
188	Backend Developer	Python	Async	How do you handle real-time message delivery in a chat application using Python?	medium	{Python,Async,"System Design"}	Utilize WebSockets (e.g., with `websockets` or `FastAPI`'s WebSocket support) for persistent, bidirectional communication between clients and Python chat servers. Messages are published to a message broker (like Redis Pub/Sub or Kafka) and consumed by relevant WebSocket servers to push to connected clients, ensuring low-latency delivery.	\N
189	Mobile Developer	React Native	Fundamentals	How would a React Native client establish and maintain a real-time connection for messages?	medium	{"React Native",Async,API}	A React Native client would use a WebSocket library (e.g., `react-native-websocket` or native `WebSocket` API) to establish a persistent connection to the chat server. Implement robust reconnection logic with exponential backoff for network interruptions and manage message state (sent, delivered, read) locally while syncing with the server.	\N
190	Backend Developer	Python	System Design	Describe the architecture for a scalable news feed system like Facebook.	hard	{"System Design",API,Python}	A news feed system uses fan-out (either on-write for few-to-many or on-read for many-to-few), activity service, feed generation service, and a timeline storage (e.g., Redis for hot feeds). It includes ranking algorithms, caching, and possibly a content delivery network for media, all orchestrated via microservices.	\N
191	Machine Learning Engineer (ML)	Python	System Design	How would you personalize and rank items in a user's news feed using Python?	hard	{"System Design",Python,API}	Implement a machine learning model (e.g., using `scikit-learn` or `TensorFlow`) that takes user features, item features, and interaction history to predict relevance. Features include explicit signals (likes, comments) and implicit signals (time spent, scroll depth), with models trained to optimize engagement or other business metrics.	\N
192	Backend Developer	Python	Fundamentals	How would caching be used to improve news feed performance?	medium	{"System Design",Fundamentals}	Utilize in-memory caches (e.g., Redis or Memcached) to store pre-generated or frequently accessed user feeds, reducing database load and improving retrieval latency for active users. Caching feed segments or popular posts further optimizes performance by reducing redundant computations and database lookups.	\N
195	Backend Developer	Python	System Design	Explain the design of a matching engine for connecting riders with drivers.	hard	{"System Design",Python}	The matching engine uses a geospatial index (e.g., k-d tree, geohash grid, or a dedicated geospatial database's indexing) to efficiently find nearby available drivers within a specified radius. It then applies business logic like driver rating, vehicle type, and estimated time of arrival (ETA) to rank and assign the best driver, often using a weighted scoring algorithm.	\N
196	Backend Developer	Python	System Design	Outline the main components of an e-commerce platform's architecture.	hard	{"System Design",API,Python}	An e-commerce architecture comprises Product Catalog, User Management, Shopping Cart, Order Management, Payment Gateway, Inventory, and Search services. These are typically implemented as microservices, communicating via APIs and message queues, supported by databases (SQL/NoSQL) and caching layers.	\N
197	Backend Developer	Python	Fundamentals	How would you design the product catalog service, considering product variations and searchability?	medium	{"System Design",Fundamentals}	For product catalog, use a flexible NoSQL database (e.g., MongoDB, DynamoDB) to store rich product data, including hierarchical categories, attributes, and variations efficiently. Integrate with a dedicated search engine (e.g., Elasticsearch, Solr) for fast, faceted search, full-text querying, and filtering capabilities.	\N
198	Backend Developer	Python	System Design	Describe the workflow for order processing, from placement to fulfillment.	hard	{"System Design",API,Async,Python}	Order processing begins with validation, then inventory reservation, payment authorization, and persistence in an Order Management System. An asynchronous message queue (e.g., RabbitMQ, Kafka) triggers downstream services for inventory deduction, payment capture, shipping, and notification, ensuring atomicity and fault tolerance through transactional boundaries and compensation logic.	\N
199	Frontend Developer	React	Fundamentals	How would you display a product list with filters and pagination in React?	medium	{React,JavaScript,API}	Fetch product data from a backend API using `useEffect` with dependencies for filters, current page, and items per page. Manage filter and pagination state using `useState`. Update the UI dynamically by mapping over the fetched products and providing controls for changing filters and navigating pages, re-fetching data as needed.	\N
200	Machine Learning Engineer (ML)	Python	Fundamentals	How to handle imbalanced datasets?	medium	{Python,Fundamentals}	Handling imbalanced datasets is crucial for robust model performance, especially in classification. Techniques include resampling methods like oversampling (SMOTE) or undersampling, using different evaluation metrics (F1-score, precision, recall, ROC-AUC) instead of accuracy, and algorithm-specific approaches like cost-sensitive learning or ensemble methods.	\N
201	Machine Learning Engineer (ML)	Python	Fundamentals	Explain ROC curve and precision-recall curve.	medium	{Python,Fundamentals}	The ROC (Receiver Operating Characteristic) curve plots the True Positive Rate against the False Positive Rate at various threshold settings, ideal for evaluating models with balanced classes. The Precision-Recall curve, however, plots Precision against Recall, making it more informative for imbalanced datasets where the positive class is rare.	\N
202	Machine Learning Engineer (ML)	Python	Fundamentals	How to choose evaluation metrics for regression vs classification?	medium	{Python,Fundamentals}	For regression, metrics like Mean Squared Error (MSE), Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), and R-squared are common, focusing on prediction error and fit. For classification, metrics like accuracy, precision, recall, F1-score, ROC-AUC, and log-loss are chosen based on class balance and the cost of different error types (e.g., false positives vs. false negatives).	\N
203	Machine Learning Engineer (ML)	Python	Fundamentals	Explain A/B testing in ML.	medium	{Python,Fundamentals}	A/B testing in ML involves comparing two or more versions (A and B) of a model, feature, or algorithm against each other in a controlled, randomized experiment to determine which performs better on a specific metric. It's crucial for validating new models in production environments and understanding real-world user impact before full deployment.	\N
204	Machine Learning Engineer (ML)	Python	Fundamentals	How to handle missing values?	medium	{Python,Fundamentals}	Missing values can be handled by imputation (replacing them with mean, median, mode, or more advanced methods like K-NN imputation or regression imputation) or by dropping rows/columns. The choice depends on the extent of missing data, the variable's importance, and the downstream model's sensitivity.	import pandas as pd\n# df['column'].fillna(df['column'].median(), inplace=True)\n# # Or for dropping:\n# df.dropna(subset=['column'], inplace=True)
205	Machine Learning Engineer (ML)	Python	Fundamentals	What is feature selection and why is it important?	medium	{Python,Fundamentals}	Feature selection is the process of choosing a subset of relevant features for use in model construction. It's important for reducing model complexity, preventing overfitting, improving generalization, speeding up training, and enhancing model interpretability by focusing on the most informative variables.	\N
206	Machine Learning Engineer (ML)	Python	Fundamentals	Explain PCA (Principal Component Analysis).	medium	{Python,Fundamentals}	PCA is a dimensionality reduction technique that transforms data into a new coordinate system where the axes (principal components) capture the maximum variance. It helps in reducing the number of features while retaining most of the information, combating multicollinearity, and visualizing high-dimensional data.	from sklearn.decomposition import PCA\n# pca = PCA(n_components=2)\n# principal_components = pca.fit_transform(X)
207	Deep Learning Engineer	Python	Fundamentals	Explain embeddings in ML.	medium	{Python,Fundamentals}	Embeddings are dense, low-dimensional vector representations of discrete items (like words, users, or items) that capture their semantic relationships. They allow machine learning models to process categorical data effectively by placing similar items closer in the vector space, enhancing performance for tasks like recommendation, search, and natural language processing.	\N
208	Generative AI Engineer (GenAI)	Python	Fundamentals	What is generative AI? Examples?	easy	{Python,Fundamentals}	Generative AI refers to AI models capable of generating novel and realistic content, such as images, text, audio, or code, that didn't explicitly exist in their training data. Examples include Large Language Models like GPT for text generation, DALL-E/Midjourney for image generation, and VALL-E for synthetic speech.	\N
209	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain Generative Adversarial Networks (GANs).	hard	{Python,Fundamentals}	GANs consist of two competing neural networks: a Generator that creates synthetic data (e.g., images) and a Discriminator that tries to distinguish real data from the generator's fakes. They are trained in a minimax game, where the Generator aims to fool the Discriminator, and the Discriminator aims to accurately classify, leading to the generation of highly realistic samples.	\N
210	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain Variational Autoencoders (VAE).	hard	{Python,Fundamentals}	VAEs are generative models that learn a compressed, probabilistic representation (latent space) of input data. They consist of an encoder that maps input to a distribution in the latent space and a decoder that reconstructs data from samples drawn from this latent space, enabling the generation of new, similar data by sampling from the learned distribution.	\N
211	Deep Learning Engineer	Python	Fundamentals	Explain transformers architecture.	hard	{Python,Fundamentals}	The Transformer is a neural network architecture primarily based on the self-attention mechanism, designed to process sequential data, revolutionizing NLP. It eschews recurrence and convolutions, allowing for parallel processing of input sequences and capturing long-range dependencies efficiently through its encoder-decoder structure and multi-head attention layers.	\N
212	Deep Learning Engineer	Python	Fundamentals	Explain attention mechanism.	medium	{Python,Fundamentals}	The attention mechanism allows a neural network to dynamically focus on different parts of an input sequence when processing or generating an output. It computes a weighted sum of input features, with weights learned based on the relevance of each input element to the current output, significantly improving performance in tasks like machine translation and text summarization by handling long-range dependencies.	\N
213	Generative AI Engineer (GenAI)	Python	Fundamentals	What is reinforcement learning with human feedback (RLHF)?	hard	{Python,Fundamentals}	RLHF is a technique where human preferences are used to train a reward model, which then guides a language model (or other generative model) using reinforcement learning. It helps align the model's behavior with human values and intentions, resulting in more helpful, harmless, and honest outputs, crucial for models like ChatGPT.	\N
214	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain GPT, BERT, and their differences.	hard	{Python,Fundamentals}	GPT (Generative Pre-trained Transformer) is a decoder-only transformer model primarily used for generative tasks like text completion, pre-trained on a left-to-right prediction objective. BERT (Bidirectional Encoder Representations from Transformers) is an encoder-only model designed for understanding context, pre-trained using masked language modeling and next sentence prediction, excelling in discriminative tasks like sentiment analysis and question answering.	\N
215	Generative AI Engineer (GenAI)	Python	Fundamentals	What is fine-tuning in LLMs?	medium	{Python,Fundamentals}	Fine-tuning in LLMs involves taking a pre-trained large language model and further training it on a smaller, task-specific dataset with a supervised objective. This adapts the model's general knowledge to perform specialized tasks (e.g., summarization, specific style generation) more effectively, often requiring fewer data and computational resources than training from scratch.	\N
216	Generative AI Engineer (GenAI)	Python	Fundamentals	What is prompt engineering?	medium	{Python,Fundamentals}	Prompt engineering is the art and science of crafting effective inputs (prompts) for large language models to elicit desired outputs. It involves understanding model capabilities and limitations to design prompts that guide the model towards accurate, relevant, and helpful responses for various tasks like content generation, summarization, or code generation.	\N
217	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain diffusion models in generative AI.	hard	{Python,Fundamentals}	Diffusion models are generative models that learn to reverse a gradual 'diffusion' process, where data is progressively noised until it becomes pure random noise. During generation, they iteratively denoise random data, guided by a neural network, to produce high-quality samples, excelling in image generation and other complex data synthesis tasks.	\N
218	Generative AI Engineer (GenAI)	Python	Fundamentals	What is zero-shot, one-shot, few-shot learning in LLMs?	medium	{Python,Fundamentals}	These refer to an LLM's ability to perform tasks with varying degrees of examples in the prompt. Zero-shot learning means completing a task with no examples, only instructions. One-shot provides a single example, and few-shot provides a small number of examples within the prompt to guide the model's response for a new, unseen instance.	\N
219	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain retrieval-augmented generation (RAG).	hard	{Python,Fundamentals}	RAG enhances generative models by enabling them to retrieve relevant information from an external knowledge base before generating a response. This combines the generative power of LLMs with factual accuracy, reducing hallucinations and allowing models to provide up-to-date and grounded answers, particularly useful for question-answering systems.	\N
220	Machine Learning Engineer (ML)	Python	Fundamentals	Explain explainable AI (XAI) methods like SHAP and LIME.	hard	{Python,Fundamentals}	XAI methods aim to make AI model predictions understandable to humans. SHAP (SHapley Additive exPlanations) uses game theory to calculate the contribution of each feature to a prediction. LIME (Local Interpretable Model-agnostic Explanations) approximates the behavior of any complex model locally with an interpretable model to explain individual predictions, enhancing trust and debugging capabilities.	\N
221	Data Scientist	Python	Behavioral	Discuss ethical issues and bias in AI models.	hard	{Python,Fundamentals}	Ethical issues in AI include bias, fairness, privacy, transparency, and accountability. Bias can arise from unrepresentative training data or biased algorithms, leading to discriminatory outcomes. Addressing this requires diverse data, debiasing techniques, thorough model auditing, and ensuring transparency in decision-making processes to build responsible AI systems.	\N
234	Deep Learning Engineer	Python	Behavioral	Collaborative Problem Solving in Deep Learning Projects	medium	{Python,Fundamentals}	In a team project developing a medical image segmentation model, we disagreed on using U-Net vs. Mask R-CNN. I facilitated a discussion, presenting benchmarks and pros/cons for each, leading us to prototype both on a small dataset. This data-driven approach helped us unanimously select the U-Net for its superior performance and simpler architecture for our specific task.	\N
222	Machine Learning Engineer (ML)	Python	Coding	Calculate Classification Metrics (Accuracy, Precision, Recall)	easy	{Python,Coding,Fundamentals}	These metrics are crucial for evaluating classification models. Accuracy measures overall correctness, precision quantifies the proportion of true positive predictions among all positive predictions, and recall (sensitivity) measures the proportion of true positive predictions among all actual positives.	def calculate_metrics(y_true, y_pred):\n    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)\n    tn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 0)\n    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)\n    fm = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)\n    accuracy = (tp + tn) / len(y_true)\n    precision = tp / (tp + fp) if (tp + fp) > 0 else 0\n    recall = tp / (tp + fm) if (tp + fm) > 0 else 0\n    return accuracy, precision, recall
223	Machine Learning Engineer (ML)	Python	Coding	Split Dataset into Training and Testing Sets	easy	{Python,Coding,Fundamentals}	Splitting a dataset into training and testing sets is fundamental for evaluating a model's generalization ability, preventing overfitting. A common split is 70-80% for training and the remainder for testing, ensuring the model learns from one subset and is evaluated on unseen data.	from sklearn.model_selection import train_test_split\nimport pandas as pd\n\ndef split_data(X, y, test_size=0.2, random_state=42):\n    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)\n    return X_train, X_test, y_train, y_test\n\n# Example usage with dummy data\n# X = pd.DataFrame({'feature1': range(100), 'feature2': range(100,200)})\n# y = pd.Series([i % 2 for i in range(100)])\n# X_train, X_test, y_train, y_test = split_data(X, y)
224	Machine Learning Engineer (ML)	Python	Coding	Implement Linear Regression from Scratch	medium	{Python,Coding,Fundamentals}	Implementing linear regression from scratch demonstrates understanding of its core principles: modeling a linear relationship between input features and a continuous output, typically optimized using Ordinary Least Squares (OLS) or Gradient Descent to minimize the mean squared error.	import numpy as np\n\nclass LinearRegression:\n    def __init__(self, learning_rate=0.01, n_iterations=1000):\n        self.lr = learning_rate\n        self.n_iterations = n_iterations\n        self.weights = None\n        self.bias = None\n\n    def fit(self, X, y):\n        n_samples, n_features = X.shape\n        self.weights = np.zeros(n_features)\n        self.bias = 0\n\n        for _ in range(self.n_iterations):\n            y_pred = np.dot(X, self.weights) + self.bias\n            dw = (1/n_samples) * np.dot(X.T, (y_pred - y))\n            db = (1/n_samples) * np.sum(y_pred - y)\n            self.weights -= self.lr * dw\n            self.bias -= self.lr * db\n\n    def predict(self, X):\n        return np.dot(X, self.weights) + self.bias
225	Machine Learning Engineer (ML)	Python	Coding	Implement Logistic Regression from Scratch	medium	{Python,Coding,Fundamentals}	Logistic regression, despite its name, is a classification algorithm that uses the sigmoid function to map predictions to probabilities between 0 and 1. It optimizes coefficients by minimizing a log-loss (cross-entropy) function via gradient descent, suitable for binary classification tasks.	import numpy as np\n\nclass LogisticRegression:\n    def __init__(self, learning_rate=0.01, n_iterations=1000):\n        self.lr = learning_rate\n        self.n_iterations = n_iterations\n        self.weights = None\n        self.bias = None\n\n    def _sigmoid(self, z):\n        return 1 / (1 + np.exp(-z))\n\n    def fit(self, X, y):\n        n_samples, n_features = X.shape\n        self.weights = np.zeros(n_features)\n        self.bias = 0\n\n        for _ in range(self.n_iterations):\n            linear_model = np.dot(X, self.weights) + self.bias\n            y_predicted = self._sigmoid(linear_model)\n            dw = (1/n_samples) * np.dot(X.T, (y_predicted - y))\n            db = (1/n_samples) * np.sum(y_predicted - y)\n            self.weights -= self.lr * dw\n            self.bias -= self.lr * db\n\n    def predict(self, X):\n        linear_model = np.dot(X, self.weights) + self.bias\n        y_predicted = self._sigmoid(linear_model)\n        return np.array([1 if i > 0.5 else 0 for i in y_predicted])
226	Machine Learning Engineer (ML)	Python	Coding	Implement K-Means Clustering from Scratch	medium	{Python,Coding,Fundamentals}	K-Means is an unsupervised iterative algorithm that partitions data into K distinct clusters. It works by alternately assigning data points to the closest centroid and then updating centroid positions as the mean of assigned points, converging when centroids stabilize.	import numpy as np\n\nclass KMeans:\n    def __init__(self, k=3, max_iters=100):\n        self.k = k\n        self.max_iters = max_iters\n        self.centroids = None\n        self.labels = None\n\n    def fit(self, X):\n        # Initialize centroids randomly\n        random_idx = np.random.choice(X.shape[0], self.k, replace=False)\n        self.centroids = X[random_idx]\n\n        for _ in range(self.max_iters):\n            # Assign points to closest centroid\n            self.labels = self._assign_clusters(X)\n            # Update centroids\n            new_centroids = self._update_centroids(X, self.labels)\n            # Check for convergence\n            if np.allclose(self.centroids, new_centroids):\n                break\n            self.centroids = new_centroids\n        return self.labels\n\n    def _assign_clusters(self, X):\n        distances = np.sqrt(((X - self.centroids[:, np.newaxis])**2).sum(axis=2))\n        return np.argmin(distances, axis=0)\n\n    def _update_centroids(self, X, labels):\n        new_centroids = np.zeros((self.k, X.shape[1]))\n        for cluster_idx in range(self.k):\n            cluster_points = X[labels == cluster_idx]\n            if len(cluster_points) > 0:\n                new_centroids[cluster_idx] = np.mean(cluster_points, axis=0)\n        return new_centroids
227	Deep Learning Engineer	Python	Coding	Implement a Simple Feedforward Neural Network	medium	{Python,Coding,Fundamentals}	A simple feedforward neural network consists of an input layer, one or more hidden layers, and an output layer, where data flows in one direction. Each neuron applies an activation function to a weighted sum of its inputs, enabling the network to learn complex non-linear relationships.	import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\nclass SimpleNN(nn.Module):\n    def __init__(self, input_size, hidden_size, output_size):\n        super(SimpleNN, self).__init__()\n        self.fc1 = nn.Linear(input_size, hidden_size)\n        self.relu = nn.ReLU()\n        self.fc2 = nn.Linear(hidden_size, output_size)\n\n    def forward(self, x):\n        out = self.fc1(x)\n        out = self.relu(out)\n        out = self.fc2(out)\n        return out\n\n# Example usage:\n# model = SimpleNN(input_size=784, hidden_size=128, output_size=10)\n# criterion = nn.CrossEntropyLoss()\n# optimizer = optim.Adam(model.parameters(), lr=0.001)
278	MLOps Engineer	Python	System Design	CI/CD pipelines for ML (GitHub Actions, Airflow, MLflow).	medium	{Python,"System Design"}	CI/CD pipelines automate the continuous integration and delivery of ML models. GitHub Actions can automate code changes and testing. Apache Airflow orchestrates complex ML workflows (data ingestion, training, evaluation). MLflow tracks experiments, registers models, and manages deployments, ensuring reproducibility and streamlined operations.	\N
228	Computer Vision Engineer	Python	Coding	Implement a Convolutional Neural Network (CNN) for Image Classification	hard	{Python,Coding,Fundamentals}	CNNs excel at image classification by employing convolutional layers to automatically learn hierarchical features, pooling layers for dimensionality reduction and spatial invariance, and fully connected layers for final classification. This architecture allows them to effectively capture patterns like edges, textures, and object parts.	import torch\nimport torch.nn as nn\n\nclass SimpleCNN(nn.Module):\n    def __init__(self, num_classes=10):\n        super(SimpleCNN, self).__init__()\n        self.conv_layers = nn.Sequential(\n            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),\n            nn.ReLU(),\n            nn.MaxPool2d(kernel_size=2, stride=2),\n            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),\n            nn.ReLU(),\n            nn.MaxPool2d(kernel_size=2, stride=2)\n        )\n        self.fc_layers = nn.Sequential(\n            nn.Linear(64 * 8 * 8, 128), # Assuming input image of size 32x32\n            nn.ReLU(),\n            nn.Linear(128, num_classes)\n        )\n\n    def forward(self, x):\n        out = self.conv_layers(x)\n        out = out.reshape(out.size(0), -1) # Flatten for fully connected layer\n        out = self.fc_layers(out)\n        return out
229	Generative AI Engineer (GenAI)	Python	Coding	Implement a Text Preprocessing Pipeline	medium	{Python,Coding,Fundamentals}	A text preprocessing pipeline prepares raw text for machine learning models, typically involving tokenization (breaking text into words/subwords) and converting these tokens into numerical embeddings. Embeddings like Word2Vec or Transformers capture semantic relationships, significantly enhancing model performance in NLP tasks.	import spacy\nfrom gensim.models import Word2Vec\nimport numpy as np\n\nclass TextPreprocessor:\n    def __init__(self, model_name='en_core_web_sm', embedding_dim=100):\n        self.nlp = spacy.load(model_name)\n        self.embedding_dim = embedding_dim\n        self.word2vec_model = None\n\n    def tokenize_and_lemmatize(self, text):\n        doc = self.nlp(text.lower())\n        return [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]\n\n    def train_word_embeddings(self, sentences_list_of_tokens):\n        self.word2vec_model = Word2Vec(sentences_list_of_tokens, vector_size=self.embedding_dim, window=5, min_count=1, workers=4)\n\n    def get_sentence_embedding(self, tokens):\n        if not self.word2vec_model:\n            return np.zeros(self.embedding_dim)\n        \n        token_embeddings = []\n        for token in tokens:\n            if token in self.word2vec_model.wv:\n                token_embeddings.append(self.word2vec_model.wv[token])\n        \n        if token_embeddings:\n            return np.mean(token_embeddings, axis=0)\n        else:\n            return np.zeros(self.embedding_dim)\n\n# Example Usage:\n# preprocessor = TextPreprocessor()\n# text_data = ['This is a sample sentence.', 'Another sentence for demonstration.']\n# tokenized_data = [preprocessor.tokenize_and_lemmatize(text) for text in text_data]\n# preprocessor.train_word_embeddings(tokenized_data)\n# sentence_embedding = preprocessor.get_sentence_embedding(tokenized_data[0])
230	Generative AI Engineer (GenAI)	Python	Coding	Implement a Generative Adversarial Network (GAN) for Image Generation	hard	{Python,Coding}	A GAN comprises a generator, which creates synthetic images from random noise, and a discriminator, which tries to distinguish real images from generated ones. These two networks are trained adversarially, pushing the generator to produce increasingly realistic outputs until the discriminator can no longer differentiate them.	import torch\nimport torch.nn as nn\n\nclass Generator(nn.Module):\n    def __init__(self, latent_dim, img_shape):\n        super(Generator, self).__init__()\n        self.img_shape = img_shape\n        self.main = nn.Sequential(\n            nn.Linear(latent_dim, 128), # Input: latent_dim, Output: 128\n            nn.ReLU(True),\n            nn.Linear(128, 256),\n            nn.ReLU(True),\n            nn.Linear(256, 512),\n            nn.ReLU(True),\n            nn.Linear(512, int(np.prod(img_shape))),\n            nn.Tanh() # Output values between -1 and 1\n        )\n\n    def forward(self, z):\n        img = self.main(z)\n        return img.view(img.size(0), *self.img_shape)\n\nclass Discriminator(nn.Module):\n    def __init__(self, img_shape):\n        super(Discriminator, self).__init__()\n        self.main = nn.Sequential(\n            nn.Linear(int(np.prod(img_shape)), 512),\n            nn.LeakyReLU(0.2, inplace=True),\n            nn.Linear(512, 256),\n            nn.LeakyReLU(0.2, inplace=True),\n            nn.Linear(256, 1),\n            nn.Sigmoid() # Output probability between 0 and 1\n        )\n\n    def forward(self, img):\n        img_flat = img.view(img.size(0), -1)\n        validity = self.main(img_flat)\n        return validity\n\n# Example Usage:\n# latent_dim = 100\n# img_shape = (1, 28, 28) # For MNIST\n# generator = Generator(latent_dim, img_shape)\n# discriminator = Discriminator(img_shape)
231	MLOps Engineer	Python	System Design	Deploy an ML Model using Flask/FastAPI	medium	{Python,API,"System Design"}	Deploying an ML model involves wrapping its inference logic within a web API, allowing other applications to consume predictions. Flask/FastAPI are excellent choices for creating lightweight, scalable endpoints that load the trained model and expose a prediction route, often handling data serialization/deserialization.	from flask import Flask, request, jsonify\nimport joblib\nimport numpy as np\n\napp = Flask(__name__)\nmodel = joblib.load('your_model.pkl') # Load your pre-trained model\n\n@app.route('/predict', methods=['POST'])\ndef predict():\n    try:\n        data = request.get_json(force=True) # Get data from POST request\n        features = np.array(data['features']).reshape(1, -1) # Assuming single sample input\n        prediction = model.predict(features)\n        return jsonify({'prediction': prediction.tolist()})\n    except Exception as e:\n        return jsonify({'error': str(e)}), 400\n\nif __name__ == '__main__':\n    app.run(debug=True, host='0.0.0.0', port=5000)\n# To run: save model to 'your_model.pkl', then `python app.py`
232	Deep Learning Engineer	Python	Behavioral	Project Ownership and Problem Solving in Deep Learning	medium	{Python,Fundamentals}	I led an image classification project from data collection to deployment, encountering significant class imbalance. I addressed this by implementing techniques like data augmentation, transfer learning with a pre-trained ResNet, and adjusting class weights during training, ultimately achieving 92% accuracy and overcoming the initial bias.	\N
233	Deep Learning Engineer	Python	Behavioral	Adapting to New Deep Learning Techniques	medium	{Python,Fundamentals}	When working on a text summarization task, I needed to leverage a transformer-based model. I quickly learned the Hugging Face Transformers library and fine-tuned a pre-trained BART model, which allowed us to achieve state-of-the-art results for abstractive summarization much faster than building from scratch.	\N
677	AI Engineer	Python	Fundamentals	What is an LLM?	easy	{Python,Fundamentals}	An LLM (Large Language Model) is a type of deep learning model, typically a transformer-based neural network, trained on vast amounts of text data to understand, generate, and process human language at scale. They excel at diverse NLP tasks like text generation, translation, summarization, and question answering.	\N
235	Deep Learning Engineer	Python	Behavioral	Debugging and Iterating Deep Learning Models	medium	{Python,Fundamentals}	A sentiment analysis model consistently misclassified nuanced positive reviews. I debugged by analyzing misclassified samples to identify common patterns, realizing the model lacked contextual understanding for sarcasm. I then improved it by incorporating a BERT-based model with a larger pre-training corpus and additional fine-tuning on sarcastic datasets, significantly boosting accuracy.	\N
236	Deep Learning Engineer	Python	Behavioral	Addressing Bias and Ethical Concerns in Deep Learning	medium	{Python,Fundamentals}	While developing a resume screening model, I identified that it was biased against certain demographic groups due to historical data. I mitigated this by implementing fairness metrics, re-sampling techniques to balance the training data, and exploring debiasing algorithms at the embedding level, resulting in a more equitable decision-making process.	\N
279	MLOps Engineer	Python	System Design	Best practices to scale models for millions of users.	hard	{Python,"System Design"}	Scaling for millions of users requires strategies like horizontal scaling of serving infrastructure with Kubernetes, using efficient inference servers (e.g., Triton), model quantization for smaller footprints, caching frequently accessed predictions, employing distributed inference (model/pipeline parallelism), and utilizing CDNs for feature and model artifact delivery.	\N
280	Machine Learning Engineer (ML)	Python	Coding	Derive gradient of logistic regression loss function.	hard	{Python,Fundamentals,Coding}	For binary cross-entropy loss L = -[y log(h) + (1-y) log(1-h)] where h = sigmoid(Xw+b), the gradient with respect to weights 'w' is (h-y)X. This is derived by applying the chain rule: dL/dw = (dL/dh) * (dh/dz) * (dz/dw), where z = Xw+b. The dL/dh term is -(y/h) + (1-y)/(1-h) and dh/dz is h(1-h), simplifying to (h-y).	For `j`-th weight `w_j`:\n∂L/∂w_j = (h(x) - y) * x_j\n\nFor bias `b`:\n∂L/∂b = (h(x) - y)
281	Machine Learning Engineer (ML)	Python	Fundamentals	Explain eigenvalues/eigenvectors & why PCA uses them.	medium	{Python,Fundamentals}	Eigenvectors are special vectors that, when a linear transformation is applied, only change in magnitude, not direction. Their corresponding eigenvalues represent the scalar factor by which they are scaled. PCA uses them on the covariance matrix to find the principal components, which are the directions (eigenvectors) of maximum variance (eigenvalues) in the data, enabling dimensionality reduction while retaining most information.	\N
282	Machine Learning Engineer (ML)	Python	Fundamentals	Difference between covariance and correlation.	easy	{Python,Fundamentals}	Covariance measures the directional relationship between two variables; a positive value indicates they move in the same direction, negative in opposite. Correlation standardizes covariance by dividing by the product of their standard deviations, giving a unitless value between -1 and 1, indicating both direction and strength of the linear relationship.	\N
283	Machine Learning Engineer (ML)	Python	Fundamentals	What is KL divergence? Provide intuition.	medium	{Python,Fundamentals}	KL divergence (Kullback-Leibler divergence) quantifies how one probability distribution P is different from a second, reference probability distribution Q. Its intuition is that it measures the 'information gain' when one updates their beliefs from Q to P, or the 'extra bits' required to encode samples from P using a code optimized for Q.	\N
284	Machine Learning Engineer (ML)	Python	Fundamentals	What is Bayes theorem and real-world application?	easy	{Python,Fundamentals}	Bayes' theorem calculates the probability of an event based on prior knowledge or conditions that might be related to the event. It updates the prior probability to a posterior probability. A real-world application is spam filtering, where it calculates the probability an email is spam given the presence of certain words.	P(A|B) = [P(B|A) * P(A)] / P(B)
285	AI Engineer	Python	System Design	Design a system for real-time recommendation engine.	hard	{Python,"System Design"}	A real-time recommendation engine needs low-latency data pipelines (e.g., Kafka, Flink) for user interactions and feature updates, a fast feature store (e.g., Redis) for serving, candidate generation models (e.g., collaborative filtering, deep learning models) for retrieving relevant items, and a ranking model for personalizing the final list. All should be deployed with high availability and scalability (e.g., Kubernetes).	\N
286	Generative AI Engineer (GenAI)	Python	System Design	Design ChatGPT-like architecture for inference at scale.	hard	{Python,"System Design"}	This requires a distributed LLM serving architecture using techniques like model parallelism (sharding layers or tensors across GPUs) and pipeline parallelism. Key components include efficient KV caching, quantization (e.g., FP8, INT8), dynamic batching, and an inference server (e.g., NVIDIA Triton, vLLM) orchestrated by Kubernetes for high throughput, low latency, and fault tolerance.	\N
287	AI Engineer	Python	System Design	How to design a Fraud Detection System (high-latency constraints).	hard	{Python,"System Design"}	For high-latency fraud detection, critical design elements include real-time streaming data ingestion (e.g., Kafka), low-latency feature engineering (e.g., Flink), and a highly optimized, fast-inference model (e.g., tree-based models, shallow ANNs) deployed on an edge or microservice architecture. A powerful rule engine provides deterministic, low-latency checks, complemented by asynchronous deep learning models for complex patterns.	\N
288	Generative AI Engineer (GenAI)	Python	System Design	Build a RAG pipeline for 1M documents.	hard	{Python,"System Design"}	For 1M documents, the RAG pipeline needs scalable indexing: use distributed document chunking, generate embeddings with a robust embedding model, and store them in a highly performant vector database (e.g., Pinecone, Milvus, FAISS) for efficient similarity search. The retrieval should be optimized for speed, and the LLM integration must handle context window limitations and potential prompt engineering for effective grounding.	\N
289	Deep Learning Engineer	Python	System Design	Design a system to train 30B-parameter model efficiently.	hard	{Python,"System Design"}	Efficiently training a 30B-parameter model requires a distributed training system leveraging techniques like data parallelism, model parallelism (e.g., tensor parallelism, pipeline parallelism), and sharded optimizers (e.g., ZeRO). This typically involves multi-GPU/multi-node clusters, mixed-precision training, gradient checkpointing, and optimized communication libraries (e.g., NCCL) to manage memory and computational resources.	\N
294	Full Stack Developer	React	Fundamentals	Explain accessibility (ARIA roles, semantic tags). Why is it important?	medium	{HTML,Fundamentals}	Accessibility (A11y) ensures web content is usable by everyone, including those with disabilities. Semantic HTML tags (`<nav>`, `<article>`) provide inherent meaning, while ARIA roles and attributes explicitly define the purpose of UI elements for assistive technologies like screen readers, improving navigability and understanding.	\N
295	Full Stack Developer	React	Fundamentals	What is Content Security Policy (CSP) and why is it used?	medium	{HTML,API,Fundamentals}	CSP is an HTTP header that allows website administrators to declare approved sources of content that a browser should be allowed to load. It's used to mitigate Cross-Site Scripting (XSS) and other code injection attacks by restricting which resources (scripts, styles, images) a page can load and execute.	\N
296	Full Stack Developer	React	Fundamentals	Difference between Flexbox vs Grid — when do you choose which?	medium	{CSS,Fundamentals}	Flexbox is for one-dimensional layouts (either a row or a column), ideal for distributing space among items in a component. CSS Grid is for two-dimensional layouts (rows and columns simultaneously), best for overall page layout, complex structures, or when precise item placement is needed.	\N
297	Full Stack Developer	React	Fundamentals	Explain CSS specificity in detail — how browser calculates it?	hard	{CSS,Fundamentals}	CSS specificity determines which style rule gets applied when multiple selectors target the same element. It's calculated based on a hierarchy: Inline styles (1000) > IDs (100) > Classes/Attributes/Pseudo-classes (10) > Elements/Pseudo-elements (1). The rule with the highest specificity 'wins'.	\N
298	Full Stack Developer	React	Fundamentals	How to optimize CSS for performance?	hard	{CSS,Fundamentals}	Optimize CSS by minifying/compressing files, avoiding `@import` statements, using efficient selectors (e.g., BEM), and inlining critical CSS for faster initial render. Also, reduce reflows and repaints, and defer non-critical CSS loading.	\N
299	Full Stack Developer	React	Fundamentals	How does the browser calculate layout and paint?	hard	{CSS,Fundamentals}	After building the Render Tree, the browser performs Layout (or Reflow) to calculate the precise position and size of every element on the page. Then, Paint (or Rasterization) fills in the pixels for each element, drawing backgrounds, colors, images, and text onto the screen, based on the layout information.	\N
300	Full Stack Developer	React	Fundamentals	Explain BEM — why is it useful in large-scale applications?	medium	{CSS,Fundamentals}	BEM (Block-Element-Modifier) is a naming convention for CSS classes that promotes modular, reusable, and maintainable front-end code. It's useful in large-scale applications as it provides clear structure, reduces selector specificity conflicts, and improves team collaboration by standardizing class names.	\N
301	Full Stack Developer	React	Fundamentals	What is CSS reflow and repaint? How do you avoid them?	hard	{CSS,Fundamentals}	Reflow (Layout) is recalculating the geometry of elements, triggered by DOM/CSS changes affecting layout. Repaint is redrawing pixels, triggered by changes to visual properties. Avoid them by minimizing DOM manipulations, using CSS transforms/opacity for animations, and batching style changes or reading layout properties to reduce layout thrashing.	\N
302	Full Stack Developer	React	Fundamentals	Difference between relative, absolute, fixed, sticky positioning?	medium	{CSS,Fundamentals}	`relative` positions an element relative to its normal flow position. `absolute` positions relative to its nearest positioned ancestor. `fixed` positions relative to the viewport. `sticky` acts like `relative` until a scroll threshold is met, then like `fixed`.	\N
303	Full Stack Developer	React	Fundamentals	What are CSS preprocessors (SASS/LESS) and why use them?	medium	{CSS,Fundamentals}	CSS preprocessors like SASS/LESS extend CSS with programmatic features like variables, nesting, mixins, and functions. They improve maintainability, reusability, and organization of large stylesheets by allowing more dynamic and efficient styling, which then compiles into standard CSS.	\N
304	Full Stack Developer	React	Async	Explain Event Loop in detail (macrotasks vs microtasks).	hard	{JavaScript,Async,Fundamentals}	The Event Loop continuously monitors the call stack and task queues. When the call stack is empty, it first processes all microtasks (Promises, `queueMicrotask`) from the microtask queue, then picks one macrotask (`setTimeout`, `setInterval`, I/O) from the macrotask queue for execution, repeating this cycle.	\N
305	Full Stack Developer	React	Fundamentals	Explain prototypal inheritance — how does it work internally?	hard	{JavaScript,Fundamentals}	Prototypal inheritance in JavaScript allows objects to inherit properties and methods from other objects via their prototype chain. When a property is accessed, if not found directly on the object, JavaScript traverses up the `__proto__` chain until it finds the property or reaches `null`.	\N
306	Full Stack Developer	React	Fundamentals	What is Execution Context and Lexical Environment?	hard	{JavaScript,Fundamentals}	An Execution Context is an abstract concept holding the environment in which code is currently being executed (variable environment, scope chain, 'this' value). A Lexical Environment is a component of an execution context that stores identifier-variable mappings and a reference to the outer lexical environment, defining where variables and functions are available.	\N
307	Full Stack Developer	React	Fundamentals	Difference between var, let, const + TDZ concept.	medium	{JavaScript,Fundamentals}	`var` is function-scoped and hoisted with an initial value of `undefined`. `let` and `const` are block-scoped and hoisted but enter a Temporal Dead Zone (TDZ) where they cannot be accessed before initialization. `const` also prevents re-assignment after its initial declaration.	\N
308	Full Stack Developer	React	Fundamentals	What is Hoisting? How does JS hoist functions vs variables?	medium	{JavaScript,Fundamentals}	Hoisting is JavaScript's mechanism where variable and function declarations are moved to the top of their containing scope during compilation. Function declarations are fully hoisted (declaration and definition), allowing them to be called before their appearance. `var` variables are hoisted but initialized to `undefined`, while `let`/`const` are hoisted into a Temporal Dead Zone.	\N
309	Full Stack Developer	React	Fundamentals	Explain closures with real-world use cases.	hard	{JavaScript,Fundamentals}	A closure is a function that remembers and can access its outer function's scope even after the outer function has finished executing. This enables data privacy (e.g., private variables), function factories, and maintaining state for event handlers, such as creating a counter function that persists its count.	\N
310	Full Stack Developer	React	Async	What are Promises? How do Promise chaining and Promise.all work internally?	hard	{JavaScript,Async,Fundamentals}	Promises are objects representing the eventual completion or failure of an asynchronous operation. Chaining with `.then()` allows sequential execution of asynchronous tasks, where each `.then()` returns a new promise. `Promise.all` takes an iterable of promises and returns a single promise that resolves when all input promises have resolved, or rejects if any single input promise rejects.	\N
311	Full Stack Developer	React	Coding	Difference between debounce vs throttle — when use which?	hard	{JavaScript,Coding,Fundamentals}	Debounce ensures a function is executed only after a specified time has passed without any further calls, ideal for events like search input where you want to wait for user to stop typing. Throttle limits the rate at which a function is called, executing it at most once within a given timeframe, suitable for events like scrolling or resizing to prevent excessive calls.	\N
312	Full Stack Developer	React	Fundamentals	What are higher-order functions?	medium	{JavaScript,Fundamentals}	Higher-order functions are functions that either take one or more functions as arguments or return a function as their result. They are a fundamental concept in functional programming, enabling powerful abstractions and code reuse, like `map`, `filter`, and `reduce` in JavaScript.	\N
313	Full Stack Developer	React	Fundamentals	Explain this keyword in different scenarios.	hard	{JavaScript,Fundamentals}	The `this` keyword's value is determined by how a function is called: it refers to the global object in non-strict mode (default), the object owning the method, the newly created instance with `new`, or explicitly set via `call`, `apply`, or `bind`. Arrow functions lexically bind `this` to their surrounding scope.	\N
314	Full Stack Developer	React	Coding	Deep copy vs shallow copy — how to achieve each?	medium	{JavaScript,Coding,Fundamentals}	A shallow copy creates a new object/array but copies references to nested objects (e.g., spread syntax `...` or `Object.assign`). A deep copy creates a completely independent copy, duplicating all nested objects (e.g., `JSON.parse(JSON.stringify(obj))` for simple data, or a recursive cloning function for complex objects).	\N
315	Full Stack Developer	React	Coding	What is memoization and how to implement it?	hard	{JavaScript,Coding,Fundamentals}	Memoization is an optimization technique where the results of expensive function calls are cached based on their inputs. If the same inputs occur again, the cached result is returned instead of re-executing the function. It's implemented by storing input-output pairs in a `cache` (e.g., a JavaScript object or `Map`) within a closure.	\N
316	Full Stack Developer	React	Coding	What is currying? Build a curry function.	hard	{JavaScript,Coding,Fundamentals}	Currying is a transformation of a function that takes multiple arguments into a sequence of functions, each taking a single argument. It promotes functional composition and reusability, allowing for partial application of arguments.	\N
317	Full Stack Developer	React	Async	Explain async/await working internally.	hard	{JavaScript,Async,Fundamentals}	`async/await` is syntactic sugar built on Promises and Generators, making asynchronous code appear synchronous. An `async` function implicitly returns a Promise. The `await` keyword pauses the `async` function's execution until the awaited Promise settles, then unwraps its resolved value, resuming execution from that point.	\N
318	Full Stack Developer	React	Fundamentals	What is garbage collection in JS?	medium	{JavaScript,Fundamentals}	Garbage collection is an automatic memory management process in JavaScript that reclaims memory occupied by objects that are no longer reachable or referenced by the program. It prevents memory leaks and ensures efficient resource utilization without manual deallocation.	\N
319	Full Stack Developer	React	Fundamentals	Explain module systems: CommonJS vs ES Modules.	hard	{JavaScript,Fundamentals}	CommonJS (`require`/`module.exports`) is synchronous, primarily for Node.js, and copies exports. ES Modules (`import`/`export`) are asynchronous, the official JS standard for browsers and Node.js, provide live bindings to exports, and enable static analysis and tree-shaking for optimization.	\N
320	Full Stack Developer	React	Fundamentals	What is immutability? How to practice it in JS?	medium	{JavaScript,Fundamentals}	Immutability means that an object's state cannot be modified after creation. In JS, practice it by creating new objects/arrays with updated values instead of modifying originals, using methods like `map`, `filter`, `slice`, spread syntax (`...`), `Object.assign({}, obj)`, or libraries like Immer/Immutable.js.	\N
321	Full Stack Developer	React	Coding	What happens when you call new? Implement a polyfill of new.	hard	{JavaScript,Coding,Fundamentals}	When `new` is called: 1) a new empty object is created, 2) its `[[Prototype]]` is linked to the constructor's `prototype`, 3) the constructor is called with `this` bound to the new object, and 4) if the constructor returns an object, that's returned, otherwise the new object is returned.	\N
322	Full Stack Developer	React	Coding	Write a polyfill for bind method.	hard	{JavaScript,Coding,Fundamentals}	`Function.prototype.bind` creates a new function that, when called, has its `this` keyword set to the provided value, and includes any pre-specified arguments. It doesn't execute the original function immediately, but returns a bound version for later invocation.	\N
323	Full Stack Developer	React	Fundamentals	Explain how React reconciliation algorithm (Fiber) works.	medium	{React,Fundamentals}	React's Fiber reconciliation algorithm works in two phases: the 'render/reconciliation' phase builds a work-in-progress tree by comparing the new and old Virtual DOM, and the 'commit' phase applies these changes to the actual DOM. Fiber allows this work to be paused and resumed, enabling concurrent rendering and better responsiveness by yielding to the browser.	\N
324	Full Stack Developer	React	Fundamentals	Difference between controlled vs uncontrolled components.	easy	{React,Fundamentals}	Controlled components have their form data handled by React state, requiring explicit updates via `onChange` handlers, providing full control. Uncontrolled components let the DOM manage their own state internally, with React interacting via refs to get their current value, often simpler for basic forms but less declarative.	/* Controlled Example */\n<input type="text" value={name} onChange={(e) => setName(e.target.value)} />\n\n/* Uncontrolled Example */\n<input type="text" ref={inputRef} />
325	Full Stack Developer	React	Fundamentals	How React handles Virtual DOM diffing?	medium	{React,Fundamentals}	React handles Virtual DOM diffing by comparing the new Virtual DOM tree with the previous one. It uses a heuristic algorithm, first comparing element types; if different, it replaces the entire subtree. If types are the same, it compares props and only updates changed attributes, utilizing 'keys' for efficient list reordering and identification of elements.	\N
326	Full Stack Developer	React	Fundamentals	What causes re-renders in React? How do you optimize unnecessary re-renders?	medium	{React,Fundamentals}	Re-renders are caused by state changes (`useState`), prop changes, or a parent component re-rendering. To optimize, use `React.memo` for functional components, `PureComponent` for class components, and `useCallback` or `useMemo` for memoizing functions and values to prevent unnecessary re-renders of child components when their props haven't genuinely changed.	const MemoizedComponent = React.memo(MyComponent);\nconst memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
327	Full Stack Developer	React	Fundamentals	Difference between Context API vs Redux vs Recoil.	medium	{React,Fundamentals,JavaScript}	Context API is ideal for simple, localized state management or prop-drilling avoidance, suitable for themes or user authentication. Redux is a predictable state container for complex, large-scale applications, offering robust tooling and middleware. Recoil, built by Facebook, is an experimental state management library specifically for React, offering atom-based, fine-grained state updates with a more 'React-ish' feel.	\N
328	Full Stack Developer	React	Fundamentals	Explain React hooks rules and their internal working (especially useEffect).	medium	{React,Fundamentals,JavaScript}	React Hooks follow two rules: 'Only call Hooks at the top level' (no loops, conditionals, or nested functions) and 'Only call Hooks from React functions' (functional components or custom Hooks). `useEffect` internally schedules side effects to run after render, comparing its dependency array to decide whether to re-run the effect, ensuring synchronization with the component's lifecycle.	useEffect(() => { /* Side effect logic */ }, [dependency1, dependency2]);
329	Full Stack Developer	React	Async	How useEffect cleanup works?	medium	{React,Async,Fundamentals}	The `useEffect` cleanup mechanism involves returning a function from the effect callback. This returned function executes before the component unmounts or before the effect runs again (if dependencies change), allowing you to unsubscribe from subscriptions, clear timers, or release resources, preventing memory leaks and ensuring proper resource management.	useEffect(() => {\n  const timer = setTimeout(() => console.log('Hello'), 1000);\n  return () => clearTimeout(timer);\n}, []);
330	Full Stack Developer	React	Async	What is Suspense and Concurrent rendering in React 18?	hard	{React,Async,Fundamentals}	Suspense allows components to 'wait' for something (like data fetching) to load before rendering, showing a fallback UI, improving user experience during loading states. Concurrent Rendering is React 18's new architecture that makes rendering interruptible and prioritizable, allowing React to work on multiple tasks simultaneously and pause/resume rendering to keep the UI responsive, leading to smoother transitions and interactions.	<Suspense fallback={<div>Loading...</div>}>\n  <LazyLoadedComponent />\n</Suspense>
331	Full Stack Developer	React	System Design	What are Server Components? How are they different from Client components?	hard	{React,"System Design",Fundamentals}	React Server Components render entirely on the server, sending only serialized JSX to the client, leading to smaller JavaScript bundles and faster initial page loads. They can directly access backend resources (e.g., databases). Client Components, in contrast, run on the browser, are interactive, handle user events, and manage client-side state, requiring their JavaScript bundle to be downloaded and executed.	// server-component.server.js\nasync function ProductList() {\n  const products = await db.getProducts();\n  return <ul>{products.map(p => <li>{p.name}</li>)}</ul>;\n}
332	Full Stack Developer	React	Fundamentals	Explain code splitting and lazy loading in React.	medium	{React,Fundamentals}	Code splitting breaks down a large JavaScript bundle into smaller, on-demand chunks, improving initial load times. Lazy loading uses `React.lazy` and `Suspense` to load these code-split components only when they are needed (e.g., when a user navigates to a specific route), further reducing the initial bundle size and speeding up the application's first paint.	const LazyComponent = React.lazy(() => import('./MyComponent'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <LazyComponent />\n    </Suspense>\n  );\n}
333	Full Stack Developer	React	System Design	How do you optimize a page to load under 1 second?	hard	{"System Design",React,Fundamentals}	Achieving a sub-second load requires multiple strategies: optimizing critical rendering path (critical CSS, deferred JS), effective caching (CDN, browser, service worker), aggressive image optimization (responsive images, WebP), server-side rendering (SSR) or static site generation (SSG) for faster initial content, and minimizing network requests and payload sizes through compression and code splitting.	\N
334	Full Stack Developer	React	Fundamentals	Explain lazy loading vs preloading vs prefetching.	medium	{Fundamentals,React}	Lazy loading defers loading non-critical resources until they are needed (e.g., images entering viewport), saving bandwidth. Preloading proactively fetches critical resources (like essential CSS/JS) for the current page *before* they are discovered by the parser, ensuring they're available earlier. Prefetching fetches resources that *might* be needed for *future* navigations, storing them in the browser cache, to speed up subsequent user actions.	<link rel="preload" href="main.css" as="style">\n<link rel="prefetch" href="/next-page.html">
335	Full Stack Developer	React	System Design	How to reduce bundle size in production React apps?	medium	{"System Design",React}	To reduce bundle size, implement code splitting with dynamic imports and `React.lazy` for route-based or component-based chunks. Utilize tree shaking to remove unused code from libraries, ensure minification and compression (Gzip/Brotli) are enabled, and prioritize efficient image and asset delivery. Additionally, analyze bundles with tools like Webpack Bundle Analyzer to identify and optimize large dependencies.	import { lazy, Suspense } from 'react';\nconst Admin = lazy(() => import('./Admin'));
336	Full Stack Developer	React	Fundamentals	What is Critical CSS and how do you extract it?	medium	{Fundamentals,React}	Critical CSS refers to the minimum amount of CSS required to render the 'above-the-fold' content of a webpage instantly, preventing a 'flash of unstyled content' (FOUC). It's extracted by identifying styles used by elements visible on the initial viewport and inlining them directly into the HTML `<head>`, while deferring the full stylesheet load.	\N
337	Full Stack Developer	React	Fundamentals	Explain TTFB, FCP, LCP, CLS — Core Web Vitals.	medium	{Fundamentals}	TTFB (Time to First Byte) measures the server's response time for the first byte of content. FCP (First Contentful Paint) marks when the first text or image is rendered, indicating perceived loading speed. LCP (Largest Contentful Paint) measures when the largest content element is visible, representing the main content's load time. CLS (Cumulative Layout Shift) quantifies unexpected layout shifts, assessing visual stability.	\N
338	Full Stack Developer	React	System Design	How does caching work? (Memory cache, Disk cache, Service Worker cache)	medium	{"System Design",Fundamentals}	Memory cache temporarily stores recently accessed resources in RAM for very fast retrieval within a browser session. Disk cache (HTTP cache) persists resources on the hard drive, allowing reuse across sessions and tabs, managed by HTTP headers. Service Worker cache, using the Cache Storage API, provides programmatic control over network requests and caching strategies, enabling offline capabilities and custom caching rules beyond standard HTTP caching.	\N
339	Full Stack Developer	React	System Design	High-level design: How would you design a scalable frontend architecture for a large application?	hard	{"System Design",React}	A scalable frontend architecture for a large application often involves a modular approach using micro-frontends or a monorepo structure to manage independent teams and component libraries. Key considerations include robust state management (e.g., Redux Toolkit), a strong component design system, efficient data fetching strategies, performance optimizations (SSR/SSG, code splitting, image optimization), comprehensive testing, and clear deployment pipelines (CI/CD) to ensure maintainability and agility.	\N
340	Full Stack Developer	React	Fundamentals	Explain how JavaScript engines (V8) compile and optimize code (Ignition + TurboFan).	hard	{JavaScript,Fundamentals}	V8 uses Ignition to compile JavaScript into bytecode, which is then executed. For 'hot' code paths (frequently executed), TurboFan (optimizing compiler) takes over, recompiling bytecode into highly optimized machine code. If assumptions made during optimization are invalidated, TurboFan can deoptimize back to bytecode for correctness.	\N
341	Full Stack Developer	React	Fundamentals	What is Hidden Class (V8) and property transitions? How do they affect performance?	hard	{JavaScript,Fundamentals}	Hidden Classes are internal V8 objects that describe the shape (properties and their types) of an object. V8 creates new hidden classes and transitions between them when object properties are added or modified. This allows V8 to optimize property access by knowing the memory offset of properties, avoiding costly dictionary lookups and improving performance, especially for objects with consistent shapes.	const obj = {}; // C0\nobj.x = 1;     // C1 (transition from C0)\nobj.y = 2;     // C2 (transition from C1)
342	Full Stack Developer	React	Fundamentals	How does garbage collection work in V8? (Mark-Sweep, Scavenge)	hard	{JavaScript,Fundamentals}	V8 uses a generational garbage collector. The 'Scavenge' algorithm (a copying collector) handles the 'young generation' (newly allocated objects), which are short-lived. For the 'old generation' (long-lived objects), V8 employs 'Mark-Sweep' to mark unreachable objects and reclaim memory, followed by 'Mark-Compact' to defragment memory, reducing pause times by distributing work.	\N
343	Full Stack Developer	React	Fundamentals	What is a generator function? Explain its internal execution.	hard	{JavaScript,Async,Fundamentals}	A generator function (`function*`) returns an iterator object, allowing it to pause execution and resume later. It internally maintains its execution context (scope, variables) across `yield` statements, returning a value with `yield` and consuming `next()` calls to proceed. This enables powerful asynchronous control flow and lazy evaluation.	function* idMaker() { let id = 0; while(true) yield id++; }\nconst gen = idMaker(); console.log(gen.next().value); // 0
344	Full Stack Developer	React	Async	Difference between microtask queue, macrotask queue, and animation frame queue?	hard	{JavaScript,Async,Fundamentals}	The event loop prioritizes microtasks (e.g., Promise callbacks, `queueMicrotask`) which are executed completely before the browser renders or moves to the next macrotask. Macrotasks (e.g., `setTimeout`, `setInterval`, I/O) are processed one per loop iteration. The animation frame queue (`requestAnimationFrame`) is specifically for visual updates, syncing callbacks just before the browser's repaint cycle for smooth animations.	\N
345	Full Stack Developer	React	Async	How does async/await transform into Promises internally?	hard	{JavaScript,Async,Fundamentals}	`async/await` is syntactic sugar built on Promises and generators. An `async` function implicitly returns a Promise. The `await` keyword pauses the execution of the `async` function until the awaited Promise settles (resolves or rejects), then resumes with its value or throws its error. Internally, this is typically implemented using a state machine that manages the generator's execution.	async function fetchData() {\n  const res = await fetch('/api/data');\n  return res.json();\n}
346	Full Stack Developer	React	Fundamentals	Explain tail call optimization and why JS does not support it widely.	hard	{JavaScript,Fundamentals}	Tail Call Optimization (TCO) is a compiler optimization that reuses a stack frame for a function call if it's the very last operation. This prevents stack overflow errors in deep recursion. JavaScript (ECMAScript) specifies TCO for 'strict mode' but browser engines haven't widely implemented it due to challenges with preserving debugging stack traces and ensuring consistent behavior across environments.	function factorial(n, acc = 1) {\n  if (n <= 1) return acc;\n  return factorial(n - 1, n * acc); // A tail call\n}
347	Full Stack Developer	React	Fundamentals	What are WeakMap, WeakSet — why are keys weakly referenced?	hard	{JavaScript,Fundamentals}	WeakMap and WeakSet are collections where keys (objects) are weakly referenced, meaning they don't prevent the garbage collector from reclaiming the key if there are no other references to it. This makes them ideal for associating metadata with objects without causing memory leaks, as entries are automatically removed when the key object is garbage collected, unlike Map/Set.	const wm = new WeakMap();\nlet obj = {};\nwm.set(obj, 'data');\nobj = null; // obj can now be garbage collected, removing the WeakMap entry
348	Full Stack Developer	React	Fundamentals	What is a memory leak in JavaScript? Common causes and detection.	hard	{JavaScript,Fundamentals}	A memory leak occurs when an application unintentionally retains references to objects that are no longer needed, preventing them from being garbage collected and leading to increased memory consumption. Common causes include accidental global variables, detached DOM elements, infinite event listeners, and closures retaining large scope. Detection involves using browser dev tools like heap snapshots and performance monitors.	let globalData = [];\nfunction addData(item) { globalData.push(item); } // globalData can grow indefinitely
349	Full Stack Developer	React	Fundamentals	How does event delegation work internally in browsers?	hard	{JavaScript,Fundamentals}	Event delegation leverages event bubbling, where an event triggered on a child element propagates up the DOM tree to its ancestors. Instead of attaching individual event listeners to multiple child elements, a single listener is attached to a common parent. The browser then identifies the actual target element using `event.target` inside the parent's handler, significantly reducing memory usage and improving performance.	document.getElementById('parent').addEventListener('click', function(event) {\n  if (event.target.matches('.child')) {\n    console.log('Child clicked:', event.target.textContent);\n  }\n});
350	Full Stack Developer	React	Coding	Implement a custom event emitter (write logic).	hard	{JavaScript,Coding,Fundamentals}	A custom event emitter manages subscriptions and dispatches events. It typically uses a Map or Object to store event names as keys and arrays of listener functions as values. `on` registers a listener, `emit` iterates and calls listeners for an event, and `off` removes a specific listener.	class EventEmitter {\n  constructor() { this.events = new Map(); }\n  on(eventName, listener) {\n    if (!this.events.has(eventName)) this.events.set(eventName, []);\n    this.events.get(eventName).push(listener);\n  }\n  emit(eventName, ...args) {\n    const listeners = this.events.get(eventName);\n    if (listeners) listeners.forEach(listener => listener(...args));\n  }\n  off(eventName, listener) {\n    const listeners = this.events.get(eventName);\n    if (listeners) {\n      this.events.set(eventName, listeners.filter(l => l !== listener));\n    }\n  }\n}
351	Full Stack Developer	React	Coding	Build your own Promise implementation (polyfill).	hard	{JavaScript,Coding,Async}	A Promise implementation involves managing internal state (pending, fulfilled, rejected), storing resolution/rejection values, and maintaining queues of `then` callbacks. Callbacks are typically scheduled as microtasks to ensure asynchronous execution order. `resolve` and `reject` methods transition the state and execute corresponding queued callbacks.	class MyPromise {\n  constructor(executor) {\n    this.state = 'pending'; this.value = undefined; this.handlers = [];\n    const resolve = (val) => { if (this.state === 'pending') { this.state = 'fulfilled'; this.value = val; this.handlers.forEach(({onFulfilled}) => queueMicrotask(() => onFulfilled(val))); } };\n    const reject = (err) => { if (this.state === 'pending') { this.state = 'rejected'; this.value = err; this.handlers.forEach(({onRejected}) => queueMicrotask(() => onRejected(err))); } };\n    try { executor(resolve, reject); } catch (error) { reject(error); }\n  }\n  then(onFulfilled, onRejected) {\n    return new MyPromise((res, rej) => {\n      const fulfill = (val) => { try { res(onFulfilled ? onFulfilled(val) : val); } catch (error) { rej(error); } };\n      const reject_ = (err) => { try { rej(onRejected ? onRejected(err) : err); } catch (error) { rej(error); } };\n      if (this.state === 'pending') { this.handlers.push({ onFulfilled: fulfill, onRejected: reject_ }); }\n      else if (this.state === 'fulfilled') { queueMicrotask(() => fulfill(this.value)); }\n      else { queueMicrotask(() => reject_(this.value)); }\n    });\n  }\n  catch(onRejected) { return this.then(null, onRejected); }\n}
352	Full Stack Developer	React	Fundamentals	How does JS handle large integer operations (BigInt)?	hard	{JavaScript,Fundamentals}	JavaScript introduces `BigInt` to handle arbitrary-precision integers, meaning they can represent numbers larger than `2^53 - 1`, which is the maximum safe integer for the standard `Number` type. `BigInt` values are created by appending 'n' to an integer literal or using `BigInt()`, and operations on them require all operands to be `BigInt`s, preventing silent precision loss.	const largeNum = 9007199254740991n + 2n; // 9007199254740993n
353	Full Stack Developer	React	Fundamentals	How do Typed Arrays / ArrayBuffers work and when to use them?	hard	{JavaScript,Fundamentals}	An `ArrayBuffer` is a raw binary data buffer, representing a fixed-length sequence of bytes. Typed Arrays (e.g., `Uint8Array`, `Float32Array`) are views into an `ArrayBuffer`, allowing JavaScript to read and write data in specific binary formats. They are crucial for high-performance operations involving binary data, such as WebSockets, WebGL, file manipulation, and WebAssembly, where direct memory control is needed.	const buffer = new ArrayBuffer(16); // 16 bytes\nconst view = new Int32Array(buffer); // View as 4 32-bit integers\nview[0] = 42;
354	Full Stack Developer	React	Fundamentals	How does WebAssembly interact with JavaScript?	hard	{JavaScript,Fundamentals}	WebAssembly (Wasm) modules are loaded, instantiated, and executed by JavaScript. JS can pass data to Wasm functions and receive results, typically through shared `ArrayBuffer` memory. Wasm can also call back into JavaScript functions using the import object provided during instantiation, allowing seamless interoperability and enabling Wasm to perform CPU-intensive tasks at near-native speed while JS handles DOM manipulation and high-level logic.	WebAssembly.instantiateStreaming(fetch('module.wasm'), importObject)\n  .then(result => {\n    const value = result.instance.exports.add(1, 2);\n    console.log(value); // 3\n  });
355	Full Stack Developer	React	Fundamentals	Deep dive into React Fiber architecture — how does scheduling work?	hard	{React,Fundamentals}	React Fiber is a reimplementation of the core reconciliation algorithm, enabling asynchronous and interruptible rendering. It introduces 'Fibers' as units of work, which are JavaScript objects representing a stack frame. Scheduling involves a work loop where React processes Fibers in chunks, pausing and resuming work to yield to the browser or higher-priority updates (e.g., user input) using `requestIdleCallback` (or an internal scheduler that simulates it) for cooperative multitasking.	\N
356	Full Stack Developer	React	Fundamentals	Explain how React batches updates — what changed in React 18 concurrency?	hard	{React,Fundamentals}	React batches multiple state updates into a single re-render for performance, preventing unnecessary UI updates. In React 18, automatic batching is applied to all updates, including those inside `setTimeout`, native event handlers, or Promises, whereas previously it only applied to React event handlers. This ensures fewer re-renders and improved performance, especially in concurrent rendering scenarios where updates can be interrupted and prioritized.	function handleClick() {\n  setCount(c => c + 1); // Batched\n  setStatus('updated'); // Batched\n}
357	Full Stack Developer	React	Fundamentals	How does React decide which part of the DOM to update (child reconciliation)?	hard	{React,Fundamentals}	React uses a 'diffing' algorithm during reconciliation. It compares the newly generated virtual DOM tree with the previous one. For child elements, it iterates through lists, attempting to match existing elements based on their `key` prop. If keys match, React reuses and updates the existing DOM node; otherwise, it creates or destroys nodes, ensuring minimal actual DOM manipulations for efficient updates.	<ul>\n  {items.map(item => <li key={item.id}>{item.text}</li>)}\n</ul>
358	Full Stack Developer	React	Fundamentals	Why do React hooks rely on call order, and how are they stored internally?	hard	{React,Fundamentals}	React hooks rely on call order because their state and effects are stored internally as a linked list (or array) associated with the component's Fiber node. When a component re-renders, React iterates through this list, expecting hooks to be called in the same sequence to correctly retrieve or update their corresponding state/effect. Deviations break this positional mapping and lead to errors.	function MyComponent() {\n  const [count, setCount] = useState(0); // Hook 1\n  const [name, setName] = useState('...'); // Hook 2\n  // Order must be consistent across renders\n}
359	Full Stack Developer	React	Coding	How do you build a virtual DOM from scratch?	hard	{React,Coding,Fundamentals}	Building a virtual DOM from scratch involves creating plain JavaScript objects (VNodes) that represent actual DOM elements and their properties. A `render` function takes a VNode tree and recursively creates the real DOM. A `diff` function then compares an old VNode tree with a new one, identifying minimal changes to apply as patches to the real DOM, optimizing updates.	const h = (type, props, ...children) => ({ type, props, children });\nconst vdom = h('div', { id: 'app' }, h('h1', null, 'Hello'));
360	Full Stack Developer	React	Fundamentals	What is hydration? Explain partial + selective hydration (Next.js).	hard	{React,Fundamentals}	Hydration is the process where client-side JavaScript takes over static HTML (pre-rendered on the server) and attaches event listeners and client-side logic, making the page interactive. Partial hydration only hydrates specific parts of the page, while selective hydration (e.g., React Server Components in Next.js) prioritizes and hydrates critical components first, deferring less important ones to improve Time To Interactive (TTI) and perceived performance.	ReactDOM.hydrateRoot(document.getElementById('root'), <App />);
361	Full Stack Developer	React	System Design	How Server Components reduce client bundle size?	hard	{React,"System Design",Fundamentals}	React Server Components (RSC) allow developers to write components that render exclusively on the server, never shipping their code to the client. Instead, the server sends a serialized representation of the component's rendered output (JSX) to the client. This significantly reduces the client-side JavaScript bundle size, leading to faster downloads, parsing, and execution, especially for static or data-intensive parts of the UI.	// server-component.js (runs only on server)\nexport default async function ServerComponent() { /* access database directly */ return <p>Data</p>; }
362	Full Stack Developer	React	System Design	How Next.js or Remix handles nested routing + streaming?	hard	{React,"System Design",Fundamentals}	Next.js and Remix leverage file-system-based nested routing, where folders/files define URL segments and their corresponding component hierarchy. Streaming allows the server to send HTML chunks as they become available, rather than waiting for the entire page. With React 18, they can combine nested routing with `Suspense` for data fetching, streaming parts of the UI as data resolves, improving perceived load times and enabling progressive rendering.	// app/dashboard/layout.js, app/dashboard/settings/page.js
363	Full Stack Developer	React	Fundamentals	What is a render-phase vs commit-phase effect?	hard	{React,Fundamentals}	The render phase (also 'reconciliation') is when React calls components to calculate the next state of the UI and constructs the new virtual DOM tree; it must be pure and free of side-effects. The commit phase is when React applies the changes to the actual DOM. Effects like `useEffect` (side effects, DOM manipulations, subscriptions) run during or after the commit phase, ensuring they interact with a fully updated and consistent DOM.	function Component() { // Render phase\n  const [count, setCount] = useState(0);\n  useEffect(() => { // Commit phase\n    document.title = `Count: ${count}`;\n  }, [count]);\n  return <div>{count}</div>;\n}
364	Full Stack Developer	React	Fundamentals	How does React detect and warn against infinite re-renders?	hard	{React,Fundamentals}	React's Strict Mode (development only) intentionally double-invokes certain functions (like component renders, `useEffect` callbacks, and memoized functions) to expose potential side effects that might lead to infinite re-renders or other issues in concurrent mode. While React itself doesn't have an explicit 'infinite loop detector' at runtime, these double-invocations help developers catch patterns like state updates within the render phase or missing `useEffect` dependency arrays that could cause such loops.	function BadComponent() {\n  const [count, setCount] = useState(0);\n  // setCount(count + 1); // Infinite loop if uncommented (render phase update)\n  return <div>{count}</div>;\n}
365	Full Stack Developer	React	Fundamentals	Explain stale closures in React — how do you prevent them?	hard	{React,Fundamentals}	A stale closure in React occurs when a function (often an event handler or an effect callback) 'closes over' and retains outdated values of props or state from an earlier render cycle. This means the function uses an old snapshot of data instead of the most current one. To prevent them, use `useEffect`'s dependency array to re-create the function when dependencies change, utilize `useCallback` or `useMemo` for memoization, or use `useRef` to store mutable values that don't trigger re-renders.	function Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => { console.log(count); /* 'count' might be stale here */ }, 1000);\n    return () => clearInterval(id);\n  }, [count]); // Adding count to dependencies prevents stale closure\n}
366	Full Stack Developer	React	Fundamentals	What is React's double render in Strict Mode — and why does it happen?	hard	{React,Fundamentals}	In React's Strict Mode (development only), components and their effects are intentionally rendered and mounted/unmounted twice. This helps identify components with unsafe side effects in their render phase or `useEffect`'s setup/cleanup logic that might not be idempotent. The double invocation aids in catching bugs that could arise in future concurrent rendering or when components are mounted/unmounted quickly, ensuring code robustness.	<React.StrictMode><App /></React.StrictMode>
367	Full Stack Developer	React	Fundamentals	Explain the browser’s multi-process architecture (Renderer, GPU, Network).	hard	{Fundamentals}	Modern browsers use a multi-process architecture to enhance stability, security, and performance. Each tab or site often runs in its own 'Renderer process' (responsible for parsing HTML/CSS, running JS, layout, paint). Separate processes handle the 'Browser UI' (main process), 'GPU' (for hardware-accelerated drawing), 'Network' (handling requests), and 'Utility' (e.g., audio/video decoding). This isolation prevents a crash in one tab from affecting others and sandboxes malicious code.	\N
368	Full Stack Developer	React	Fundamentals	How does the browser handle CRP (Critical Rendering Path) for complex pages?	hard	{Fundamentals}	The Critical Rendering Path (CRP) is the sequence of steps a browser takes to convert HTML, CSS, and JavaScript into pixels on the screen. For complex pages, the browser prioritizes critical resources by constructing the DOM and CSSOM trees, then the render tree. It defers render-blocking JavaScript and external stylesheets as much as possible, optimizes layout and paint operations, and uses `defer`/`async` for scripts to ensure the fastest possible 'first paint' and 'first contentful paint'.	<link rel="preload" href="critical.css" as="style" onload="this.rel='stylesheet'">
369	Full Stack Developer	React	Fundamentals	Explain layout → paint → composite pipeline in-depth.	hard	{Fundamentals}	After constructing the render tree, the browser goes through three main steps: 1. **Layout**: Calculates the exact size and position of all elements on the page, relative to each other and the viewport. 2. **Paint**: Fills in the pixels for each layer, drawing text, colors, images, borders, etc., onto various rendering layers. 3. **Composite**: Combines these separate layers into a single image on the screen, often leveraging the GPU for hardware acceleration. Changes that only affect compositing (e.g., `transform` or `opacity`) are the most performant.	\N
370	Full Stack Developer	React	Fundamentals	What triggers layout thrashing and how to prevent it?	hard	{Fundamentals}	Layout thrashing (also known as 'forced synchronous layout') occurs when JavaScript repeatedly reads layout-dependent DOM properties (like `offsetWidth`, `getBoundingClientRect`) immediately after modifying the DOM. Each read forces the browser to re-calculate the entire page layout synchronously to provide an up-to-date value, leading to severe performance bottlenecks. Prevent it by batching all DOM reads, then all DOM writes, to avoid interleaving and allow the browser to optimize layout calculations.	// Bad: Layout thrashing\nfor (let i = 0; i < elements.length; i++) {\n  elements[i].style.width = elements[i].offsetWidth + 10 + 'px';\n}\n// Good: Batch reads, then writes\nconst widths = Array.from(elements).map(el => el.offsetWidth);\nfor (let i = 0; i < elements.length; i++) {\n  elements[i].style.width = widths[i] + 10 + 'px';\n}
371	Full Stack Developer	React	Async	How requestAnimationFrame syncs with the browser's refresh cycle?	hard	{JavaScript,Async,Fundamentals}	`requestAnimationFrame` (rAF) schedules a function to be executed by the browser just before its next repaint cycle (typically 60 times per second, or at the display's refresh rate). This ensures that visual updates and animations are perfectly synchronized with the browser's rendering pipeline, resulting in smooth animations without 'jank' and avoiding unnecessary renders, as the browser can batch all visual updates into a single frame.	function animate() {\n  // Perform DOM manipulations or canvas drawings\n  requestAnimationFrame(animate);\n}\nrequestAnimationFrame(animate);
372	Full Stack Developer	React	Fundamentals	Why is reading layout values (offsetHeight) expensive?	hard	{JavaScript,Fundamentals}	Reading layout values like `offsetHeight`, `scrollWidth`, `getBoundingClientRect()` is expensive because if there are any pending style changes or DOM modifications, the browser is forced to perform a synchronous recalculation of the page's layout immediately to provide an accurate value. This can trigger a 'reflow' (layout calculation) of the entire document or a significant portion of it, halting JavaScript execution and causing performance bottlenecks.	element.style.width = '100px'; // Style change\nconsole.log(element.offsetWidth); // Forces synchronous layout
373	Full Stack Developer	React	Fundamentals	How do browsers throttle timers in inactive tabs?	hard	{JavaScript,Fundamentals}	Browsers throttle timers (`setTimeout`, `setInterval`, `requestAnimationFrame`) in inactive or background tabs to conserve CPU, memory, and battery. The throttling typically limits the frequency of timer callbacks to once per second (or less) or even suspends them entirely for certain types of tasks. This optimization significantly reduces resource consumption for tabs not currently in view, improving overall system performance and user experience.	\N
374	Full Stack Developer	React	Fundamentals	Explain process isolation between iframes.	hard	{Fundamentals}	Modern browsers can render `<iframe>` content in separate renderer processes (or isolated `BrowsingContext`s), especially if the iframe is cross-origin. This 'process isolation' acts as a security sandbox, preventing malicious code within an iframe from directly accessing or manipulating the parent page's DOM, JavaScript, or other iframes. It also enhances stability, as a crash in an iframe's process won't bring down the entire browser tab or application, and allows for better resource management.	\N
375	Full Stack Developer	React	Fundamentals	What is same-origin policy? Deep explanation, not definition.	hard	{Fundamentals,API}	The Same-Origin Policy (SOP) is a critical browser security mechanism that restricts how a document or script loaded from one 'origin' (scheme, host, port) can interact with a resource from another. Specifically, it prevents JavaScript from reading data or making direct API calls to another origin unless explicitly permitted (e.g., via CORS). While it allows embedding resources (like images or scripts), it strictly enforces read access, preventing cross-site scripting (XSS) and data theft by ensuring untrusted code can't access sensitive information from different domains.	\N
376	Full Stack Developer	React	Fundamentals	How does CORS work at the low-level HTTP + browser policy level?	hard	{API,Fundamentals}	CORS (Cross-Origin Resource Sharing) is a browser security feature that allows a web application running at one origin to access selected resources from a different origin. At the HTTP level, the requesting browser includes an `Origin` header. The server then responds with `Access-Control-Allow-Origin` (e.g., `*` or a specific origin) to grant permission. For 'complex' requests (e.g., non-GET/POST, custom headers), the browser first sends an `OPTIONS` 'preflight' request with `Access-Control-Request-Method` and `Access-Control-Request-Headers` to check server-side permissions before sending the actual request, ensuring safety before data is sent.	// Client Request Headers\nOrigin: https://example.com\n\n// Server Response Headers\nAccess-Control-Allow-Origin: https://example.com\nAccess-Control-Allow-Methods: GET, POST
377	Full Stack Developer	React	System Design	How would you architect a frontend for a website that receives 10 million users/day?	hard	{"System Design",React}	For 10M users/day, I'd prioritize performance, scalability, and resilience. This involves a server-side rendered (SSR) or statically generated (SSG) React application served via a CDN for fast global delivery. Key optimizations include aggressive code splitting, lazy loading, image optimization, critical CSS, and preloading. Backend communication would use efficient APIs, potentially GraphQL or gRPC, with robust caching at multiple layers, and extensive monitoring to quickly identify bottlenecks.	\N
378	Full Stack Developer	React	System Design	How do you reduce initial JavaScript execution time (JS main-thread bottleneck)?	hard	{"System Design",JavaScript}	To reduce initial JS execution time, I'd implement aggressive code splitting (route-based, component-based, vendor), tree-shaking to eliminate unused code, and lazy loading for non-critical components or modules. Server-Side Rendering (SSR) or Static Site Generation (SSG) reduces the initial JS needed for content. Further optimizations include using Web Workers to offload heavy computations, deferring non-critical scripts, and optimizing bundles to minimize parse/compile time.	const MyComponent = React.lazy(() => import('./MyComponent'));
379	Full Stack Developer	React	System Design	Explain the trade-offs between CSR vs SSR vs SSG vs ISR.	hard	{"System Design",React}	CSR (Client-Side Rendering) is dynamic but poor for SEO/TTFB. SSR (Server-Side Rendering) provides good SEO/TTFB but can have slower 'time to interact' for dynamic content. SSG (Static Site Generation) offers best performance/SEO but is only suitable for entirely static content. ISR (Incremental Static Regeneration) combines SSG's benefits with SSR's dynamism by incrementally rebuilding pages, balancing performance with content freshness. Each has trade-offs in build time, data freshness, and server load.	\N
380	Full Stack Developer	React	System Design	How do you split code based on route boundaries + component boundaries?	hard	{"System Design",JavaScript,React}	Code splitting based on route boundaries means dynamically importing entire pages/routes, often with `React.lazy` and `Suspense` for React applications, loading only the necessary code when a user navigates. Component-based splitting involves lazy-loading individual heavy components that aren't critical for the initial render or are shown conditionally. This minimizes the initial bundle size, improving initial load times and overall application performance by deferring JavaScript execution.	const HomePage = React.lazy(() => import('./pages/Home'));\n// ... in router config\n<Route path="/" element={<Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>} />
381	Full Stack Developer	React	System Design	How do you design an offline-first web application with sync mechanism?	hard	{"System Design",JavaScript}	An offline-first application prioritizes local data access, ensuring functionality without network. I'd use Service Workers for aggressive caching of assets (App Shell) and data (Cache Storage API). User data modifications are stored in IndexedDB. A background sync mechanism, often implemented via a Service Worker's `sync` event, queues offline changes and attempts to synchronize them with the server once connectivity is restored, handling conflicts and ensuring data consistency.	// Registering service worker\nnavigator.serviceWorker.register('/sw.js');\n// Requesting background sync\nnavigator.serviceWorker.ready.then(sw => sw.sync.register('sync-new-post'));
382	Full Stack Developer	React	System Design	How do you optimize React hydration on very large pages?	hard	{"System Design",React}	Optimizing hydration on large pages involves reducing the amount of JavaScript and work needed at initial load. Key strategies include: selective/partial hydration (hydrating only interactive parts), deferring hydration of off-screen or non-critical components, lazy loading components with `React.lazy` and `Suspense`, using React Server Components to minimize client JS, and ensuring the server-rendered HTML is as small and efficient as possible to speed up initial parsing.	\N
383	Full Stack Developer	React	System Design	How do you design a component library for a company (scalable, themeable)?	hard	{"System Design",React}	A scalable and themeable component library requires an Atomic Design approach, robust documentation (e.g., Storybook), clear prop APIs, comprehensive unit/integration tests, and accessibility considerations. Themeability is achieved using CSS variables or a `ThemeProvider` context to inject design tokens. Version control (semantic versioning), automated releases, and careful dependency management ensure maintainability and ease of adoption across multiple projects.	import { ThemeProvider } from 'styled-components';\nconst theme = { primary: '#007bff' };\n<ThemeProvider theme={theme}><Button /></ThemeProvider>
384	Full Stack Developer	React	System Design	How do you prevent regressions in bundle size after scaling to 100+ developers?	hard	{"System Design",JavaScript}	To prevent bundle size regressions with a large team, implement automated bundle size tracking in CI/CD, setting up budget limits and alerts on PRs that exceed thresholds. Regularly audit dependencies for bloat using tools like Webpack Bundle Analyzer. Enforce consistent code splitting and lazy loading guidelines, educate developers on performance best practices, and introduce a 'bundle size sheriff' rotation to monitor and address issues proactively.	\N
385	Generative AI Engineer (GenAI)	Python	Fundamentals	Difference between multiprocessing vs multithreading in Python for ML workloads?	hard	{Python,Fundamentals,"System Design"}	Multithreading uses multiple threads within a single process and is limited by Python's GIL, making it suitable for I/O-bound tasks. Multiprocessing uses separate processes, each with its own Python interpreter and memory space, bypassing the GIL for true parallelism on CPU-bound tasks, crucial for parallel data preprocessing or model training components in ML.	\N
386	Generative AI Engineer (GenAI)	Python	Fundamentals	How does GIL affect model inference in Python? How do you bypass it?	hard	{Python,Fundamentals}	The GIL (Global Interpreter Lock) prevents multiple native threads from executing Python bytecodes simultaneously. For CPU-bound model inference, this means only one thread can execute at a time, hindering parallel CPU utilization. It's bypassed by using multiprocessing, offloading computations to C extensions (like NumPy, PyTorch's C++ backend), or specialized libraries that release the GIL during heavy computation.	\N
387	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain memory leaks in Python when training deep learning models.	hard	{Python,Fundamentals,"System Design"}	Memory leaks in deep learning often occur due to retaining references to computation graphs or large intermediate tensors, especially in loops without proper cleanup or when detaching graphs. For instance, `torch.autograd.set_detect_anomaly(True)` can help identify where tensors are accumulating, and using `with torch.no_grad():` or `tensor.detach()` can prevent graph retention for inference parts.	import torch\n\ndef leak_example():\n    history = []\n    for _ in range(10):\n        x = torch.randn(1000, 1000, requires_grad=True)\n        y = x @ x # Computation graph attached\n        history.append(y) # Retains reference, causing leak\n        # Fix: history.append(y.detach())\n    return history
752	AI Engineer	Python	Behavioral	How do you handle conflict in a team?	easy	{Fundamentals}	I approach conflict by first listening actively to understand all perspectives, focusing on the issue rather than personal attacks. I then facilitate open communication to find common ground and work towards a solution that benefits the project and maintains team cohesion, prioritizing respectful and constructive dialogue.	\N
388	Generative AI Engineer (GenAI)	Python	Async	How does asyncio help in high-throughput inference servers?	hard	{Python,Async,"System Design"}	Asyncio enables concurrent handling of many I/O-bound requests using a single thread, preventing the server from blocking while waiting for external resources (e.g., database calls, network fetches) or LLM generation. This non-blocking approach maximizes resource utilization, allowing a high volume of inference requests to be processed efficiently without the overhead of multiple OS threads/processes.	import asyncio\n\nasync def process_inference_request(request_data):\n    # Simulate I/O-bound task like fetching data or LLM call\n    await asyncio.sleep(0.1)\n    return f'Processed {request_data}'\n\nasync def main():\n    results = await asyncio.gather(\n        process_inference_request('req1'),\n        process_inference_request('req2')\n    )\n    print(results)
389	Generative AI Engineer (GenAI)	Python	Fundamentals	Difference between NumPy broadcasting vs PyTorch broadcasting.	medium	{Python,Fundamentals}	Both NumPy and PyTorch broadcasting follow similar rules: dimensions are compared starting from the trailing dimension, and they must either be equal or one of them must be 1. PyTorch extends this with more explicit shape manipulation utilities like `expand()`, crucial for deep learning tensor operations and GPU acceleration, but the core mechanics are very similar for element-wise operations.	import numpy as np\nimport torch\n\na_np = np.array([1, 2, 3])\nb_np = np.array([[0],[10],[20]])\nc_torch = torch.tensor([1, 2, 3])\nd_torch = torch.tensor([[0],[10],[20]])\n\n# Broadcasting works similarly\nresult_np = a_np + b_np\nresult_torch = c_torch + d_torch
390	Generative AI Engineer (GenAI)	Python	System Design	Explain dataloader bottlenecks in PyTorch and how to optimize them.	hard	{Python,"System Design",Fundamentals}	Dataloader bottlenecks occur when data loading and preprocessing on the CPU cannot keep up with GPU consumption, leaving the GPU idle. Optimizations include increasing `num_workers` to parallelize data loading, enabling `pin_memory=True` for faster GPU transfers, using efficient data augmentation libraries, and pre-processing data offline or on the GPU itself to reduce runtime overhead.	from torch.utils.data import DataLoader, Dataset\n\nclass CustomDataset(Dataset):\n    # ... dataset implementation ...\n\ndataset = CustomDataset()\ndataloader = DataLoader(dataset, batch_size=32,\n                        num_workers=4, pin_memory=True)
391	Generative AI Engineer (GenAI)	Python	Coding	What are Python generators? Why are they useful for streaming LLM outputs?	medium	{Python,Coding,Fundamentals}	Python generators are functions that `yield` values, pausing execution and saving their state, resuming from where they left off. They are memory efficient as they produce values one at a time, on demand. For streaming LLM outputs, generators allow tokens to be sent to the client as they are generated, reducing perceived latency and memory usage by not buffering the entire response.	def llm_stream_generator():\n    tokens = ['Hello', ',', ' world', '!']\n    for token in tokens:\n        yield token\n\n# Usage:\n# for chunk in llm_stream_generator():\n#     print(chunk, end='')
392	Generative AI Engineer (GenAI)	Python	System Design	How do you optimize Python code for GPU/TPU workloads?	hard	{Python,"System Design",Fundamentals}	Optimization involves minimizing CPU-GPU data transfers, maximizing GPU utilization through large batch sizes, and leveraging frameworks like PyTorch or TensorFlow for their optimized C++ kernels. Techniques include mixed-precision training (FP16), using optimized data loaders, implementing gradient accumulation, and ensuring computations are performed directly on the accelerator when possible.	import torch\n\ndevice = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\nmodel = Model().to(device)\ninputs = inputs.to(device)\n\nwith torch.cuda.amp.autocast(): # Mixed precision\n    outputs = model(inputs)
393	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain attention mechanism mathematically with complexity analysis.	hard	{Fundamentals}	Scaled Dot-Product Attention computes scores = (Q K^T) / sqrt(d_k), applies softmax, then multiplies by V. Mathematically, Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V. Its complexity is O(N^2 * d) time and O(N^2) memory for a sequence of length N and hidden dimension d, primarily due to the QK^T matrix multiplication.	\N
394	Generative AI Engineer (GenAI)	Python	Fundamentals	Why is softmax unstable for large logits? How do we stabilize it?	hard	{Fundamentals}	Softmax becomes unstable for large positive or negative logits due to `exp()` operations, leading to overflow (infinity) or underflow (zero) respectively, resulting in NaN or incorrect probabilities. It's stabilized by using the log-sum-exp trick: subtracting the maximum logit from all logits before applying `exp()`, which numerically shifts values without changing the output probabilities.	import torch\n\ndef stable_softmax(x):\n    max_val = x.max(dim=-1, keepdim=True).values\n    return torch.exp(x - max_val) / torch.sum(torch.exp(x - max_val), dim=-1, keepdim=True)
395	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain LayerNorm vs BatchNorm — why LayerNorm is preferred in LLMs?	hard	{Fundamentals}	BatchNorm normalizes features across the batch dimension and spatial dimensions, making it batch-dependent. LayerNorm normalizes features across the feature dimension for each individual sample, making it batch-independent. LayerNorm is preferred in LLMs because sequence lengths are often variable, and its independence from batch size makes it more stable and effective during training, especially with small batches or inference.	\N
396	Generative AI Engineer (GenAI)	Python	System Design	Explain KV cache — how it speeds up autoregressive inference?	hard	{Fundamentals,"System Design"}	The KV cache stores previously computed Key (K) and Value (V) vectors from self-attention layers for already generated tokens. In autoregressive inference, instead of recomputing K and V for the entire sequence at each step, the model only computes them for the new token and concatenates them with the cached values. This reduces the attention computation complexity from O(N^2) to O(N) for subsequent tokens, significantly speeding up generation.	\N
397	Generative AI Engineer (GenAI)	Python	Fundamentals	What is rotary positional embedding (RoPE)? Compare with absolute + relative.	hard	{Fundamentals}	RoPE encodes positional information by rotating query and key vectors based on their absolute positions, such that dot products implicitly capture relative positional information. Unlike absolute positional embeddings (fixed or learned vectors added to input) or traditional relative embeddings (which add learnable biases or content-based relative encoding), RoPE offers better extrapolation to longer sequences by operating in the complex plane, making it inherently more efficient and robust for varying context lengths.	\N
398	Generative AI Engineer (GenAI)	Python	System Design	How do you prevent gradient explosion during training large models?	hard	{Fundamentals,"System Design"}	Gradient explosion, where gradients become excessively large, is primarily prevented by Gradient Clipping, which scales down gradients if their L2 norm exceeds a threshold. Other methods include using Residual Connections (e.g., in ResNets, Transformers) and Layer Normalization, which help stabilize the gradient flow through deep networks.	import torch\n\n# During training loop, after backward()\ntorch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
399	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain weight tying in language models.	hard	{Fundamentals}	Weight tying in language models refers to sharing the weight matrix between the input embedding layer and the output softmax layer. This means the matrix used to project one-hot encoded tokens to embeddings is the transpose of the matrix used to project final hidden states back to vocabulary logits. It reduces model parameters, improves generalization by linking input and output representations, and is common in Transformer-based LLMs.	\N
400	Generative AI Engineer (GenAI)	Python	System Design	What are model shards? Explain ZeRO-1, ZeRO-2, ZeRO-3 optimization (DeepSpeed).	hard	{"System Design",Fundamentals}	Model shards are partitions of a large model (parameters, gradients, optimizer states) distributed across multiple devices to fit models that exceed single-GPU memory. ZeRO (Zero Redundancy Optimizer) in DeepSpeed orchestrates this: ZeRO-1 shards only optimizer states, ZeRO-2 shards optimizer states and gradients, and ZeRO-3 shards optimizer states, gradients, and model parameters, enabling training of models with trillions of parameters.	\N
401	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain transformer architecture layer by layer.	hard	{Fundamentals}	The Transformer consists of an encoder and decoder. Each encoder layer has a Multi-Head Self-Attention sub-layer and a Position-wise Feed-Forward Network. The decoder adds a masked Multi-Head Self-Attention sub-layer over its own output and an Encoder-Decoder Attention sub-layer. All sub-layers employ residual connections and are followed by Layer Normalization, with Positional Encodings added to input embeddings.	\N
402	Generative AI Engineer (GenAI)	Python	Fundamentals	Why do transformers scale poorly with sequence length?	hard	{Fundamentals}	Transformers scale poorly with sequence length primarily due to the self-attention mechanism, which has a quadratic (O(N^2)) computational complexity and memory footprint with respect to the input sequence length N. This is because every token needs to compute attention scores with every other token, leading to an N x N attention matrix.	\N
403	Generative AI Engineer (GenAI)	Python	System Design	Explain FlashAttention — why is it faster?	hard	{"System Design",Fundamentals}	FlashAttention optimizes the self-attention mechanism by reordering computations to minimize costly memory accesses between high-bandwidth memory (HBM) and faster on-chip SRAM. It computes attention in tiles, performing multiple steps (softmax, multiplication) within SRAM and only writing the final output to HBM, thereby significantly reducing I/O operations and making it much faster and more memory-efficient.	\N
404	Generative AI Engineer (GenAI)	Python	Fundamentals	How LLMs store knowledge in weights? (Interpretability perspective)	hard	{Fundamentals}	LLMs store knowledge in their billions of weights as complex, distributed patterns and representations learned from vast amounts of text. Rather than explicit facts, knowledge manifests as emergent abilities to predict the next token based on context, reflecting statistical relationships and underlying concepts. Interpretability research suggests 'circuits' or specific neurons might activate for certain concepts, but it's a highly distributed and non-linear encoding.	\N
405	Generative AI Engineer (GenAI)	Python	System Design	Explain Quantization (8-bit, 4-bit, GPTQ, AWQ) + tradeoffs.	hard	{"System Design",Fundamentals}	Quantization reduces the numerical precision of model weights (e.g., from FP16 to INT8/INT4) to decrease model size and speed up inference, with tradeoffs in accuracy. GPTQ (General Quantization) is a post-training method that quantizes weights with minimal accuracy loss by optimizing for each weight group. AWQ (Activation-aware Weight Quantization) identifies and protects 'outlier' weight channels crucial for model performance during quantization, often achieving better accuracy at higher compression ratios.	\N
406	Generative AI Engineer (GenAI)	Python	System Design	What is LoRA? Explain rank decomposition behind it.	hard	{"System Design",Fundamentals}	LoRA (Low-Rank Adaptation) is a parameter-efficient fine-tuning technique that injects small, trainable low-rank matrices into existing weight matrices of pre-trained models. This leverages rank decomposition (W_new = W_old + A @ B, where A is d x r and B is r x k, with r << min(d, k)), meaning only the much smaller A and B matrices are updated during fine-tuning, drastically reducing the number of trainable parameters and computational cost.	\N
407	Generative AI Engineer (GenAI)	Python	Fundamentals	Difference between SFT, RLHF, RLAIF, DPO?	hard	{Fundamentals}	SFT (Supervised Fine-Tuning) trains models on labeled instruction-response pairs. RLHF (Reinforcement Learning from Human Feedback) uses human preferences to train a reward model, which then guides the LLM fine-tuning via RL. RLAIF (AI Feedback) replaces human annotators with AI models for preference labeling. DPO (Direct Preference Optimization) directly optimizes the LLM policy using preference data, removing the need for an explicit reward model or complex PPO training.	\N
408	Generative AI Engineer (GenAI)	Python	System Design	Explain MoE (Mixture of Experts) — gating, routing, load balancing.	hard	{"System Design",Fundamentals}	MoE models integrate multiple 'expert' neural networks, where a 'gating network' learns to activate a subset of experts for each input token or sample. 'Routing' refers to the process of assigning inputs to specific experts. 'Load balancing' mechanisms are crucial to ensure experts are utilized evenly across a batch, preventing some experts from becoming overused or underused, which improves training stability and model performance.	\N
409	Generative AI Engineer (GenAI)	Python	System Design	How are LLMs pruned? Structured vs unstructured pruning.	hard	{"System Design",Fundamentals}	LLMs are pruned to reduce model size and accelerate inference by removing redundant parameters. Unstructured pruning removes individual weights, leading to sparse models that require specialized hardware/software. Structured pruning removes entire blocks (e.g., neurons, channels, attention heads), resulting in denser, hardware-friendly models that can be directly accelerated, though often with a larger initial accuracy drop.	\N
410	Generative AI Engineer (GenAI)	Python	System Design	What is speculative decoding? How does it improve latency?	hard	{"System Design",Fundamentals}	Speculative decoding uses a smaller, faster 'draft' model to generate a sequence of candidate tokens. The main, larger LLM then simultaneously verifies these candidate tokens. If correct, verification is much faster than full generation; if a mismatch occurs, the main LLM generates from that point. This significantly reduces overall decoding latency by parallelizing token generation and leveraging the draft model's speed for common sequences.	\N
411	Generative AI Engineer (GenAI)	Python	Fundamentals	How embeddings store semantic meaning? Explain cosine similarity.	medium	{Fundamentals}	Embeddings are dense vector representations where words, phrases, or documents with similar semantic meanings are mapped to geometrically close points in a high-dimensional space. Cosine similarity measures the cosine of the angle between two vectors, ranging from -1 (opposite) to 1 (identical). A higher cosine similarity indicates greater semantic resemblance, making it a common metric for comparing embeddings.	import numpy as np\n\ndef cosine_similarity(vec1, vec2):\n    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))\n\n# Example: vec1 = [0.1, 0.2], vec2 = [0.11, 0.22]
412	Generative AI Engineer (GenAI)	Python	Fundamentals	Compare sentence-transformers vs LLM embeddings.	medium	{Fundamentals,Python}	Sentence-transformers are specifically fine-tuned for generating high-quality sentence-level embeddings optimized for semantic similarity tasks, often through contrastive learning. LLM embeddings (e.g., the last hidden state of a `[CLS]` token or averaged token embeddings) are more general-purpose and may not be optimally suited for sentence similarity out-of-the-box without further pooling or fine-tuning, though they capture broader contextual meaning.	\N
413	Generative AI Engineer (GenAI)	Python	System Design	How do you choose chunk size for RAG? Give reasoning.	medium	{"System Design",Fundamentals}	Choosing chunk size for RAG involves balancing contextual completeness and retrieval precision. Too small, context is lost; too large, irrelevant information clutters the prompt, impacting the LLM's focus and token limits. Optimal size (e.g., 256-1024 tokens) depends on document structure, query complexity, and LLM context window, often requiring empirical testing to find the sweet spot that maximizes relevant information retrieval without excessive noise.	\N
414	Generative AI Engineer (GenAI)	Python	System Design	What is chunk-overlap and why is it necessary?	medium	{"System Design",Fundamentals}	Chunk-overlap is the amount of shared text between adjacent chunks of a document. It's necessary to ensure that context is not lost at chunk boundaries, especially when critical information or relationships might span across them. This overlap helps the retrieval system gather complete semantic units, improving the chances of retrieving all relevant information for a given query and thus reducing hallucination.	\N
415	Generative AI Engineer (GenAI)	Python	System Design	Vector DB comparison: FAISS vs Milvus vs Chroma vs Pinecone.	hard	{"System Design"}	FAISS is a local, high-performance library for similarity search. Milvus and Chroma are open-source vector databases offering persistence, scaling, and API interfaces for vector management. Pinecone is a fully managed cloud-native vector database providing enterprise-grade scalability, reliability, and ease of use, often at a higher cost, abstracting away infrastructure complexities for large-scale production deployments.	\N
416	Generative AI Engineer (GenAI)	Python	System Design	What is ANN (Approximate Nearest Neighbor Search)? HNSW vs IVF.	hard	{"System Design",Fundamentals}	ANN (Approximate Nearest Neighbor) search finds approximate closest vectors faster than exact search by sacrificing some recall for speed, crucial for large datasets. HNSW (Hierarchical Navigable Small World) builds a multi-layer graph where each layer contains a subset of points for efficient traversals. IVF (Inverted File Index) partitions the vector space into clusters and searches only a few relevant clusters, often used with product quantization for further compression.	\N
417	Generative AI Engineer (GenAI)	Python	System Design	How to prevent hallucination in RAG-based systems?	hard	{"System Design",Fundamentals}	Preventing hallucination involves improving retrieval quality (e.g., better chunking, re-ranking, advanced indexing), ensuring the LLM is strictly grounded by the provided context through prompt engineering ('only answer based on the context'), using smaller, more precise LLMs for specific tasks, implementing fact-checking layers post-generation, and validating the factual accuracy of source documents.	\N
418	Generative AI Engineer (GenAI)	Python	System Design	Explain hybrid search (BM25 + Vector search).	hard	{"System Design",Fundamentals}	Hybrid search combines lexical search (e.g., BM25, which excels at keyword matching and term frequency) with semantic vector search (which captures conceptual similarity through embeddings). By blending the scores from both methods, it leverages the strengths of each, providing a more comprehensive and robust retrieval that addresses both exact keyword relevance and underlying semantic meaning, leading to more accurate results.	\N
419	Generative AI Engineer (GenAI)	Python	System Design	How to evaluate RAG performance (MRR, Recall@k, nDCG)?	hard	{"System Design",Fundamentals}	RAG performance is evaluated by retrieval and generation quality. Retrieval metrics include: Recall@k (percentage of queries where at least one relevant document is in the top-k retrieved), MRR (Mean Reciprocal Rank, averages inverse ranks of first relevant document), and nDCG (normalized Discounted Cumulative Gain, which considers graded relevance and position). Generation quality is often assessed using LLM-as-judge or human evaluation.	\N
420	Generative AI Engineer (GenAI)	Python	System Design	What is document re-ranking? Why is it needed?	medium	{"System Design",Fundamentals}	Document re-ranking is the process of re-sorting an initial set of retrieved documents (e.g., from vector search) to improve their relevance order for the LLM. It's needed because initial retrieval can be noisy or miss nuanced contextual relevance. A re-ranker, often a smaller, more focused LLM or a cross-encoder, performs a more detailed relevance assessment on the top-N documents, ensuring the most pertinent information is presented to the generator first.	\N
421	Generative AI Engineer (GenAI)	Python	System Design	Difference between full finetuning, LoRA, QLoRA, DoRA.	hard	{"System Design",Fundamentals}	Full finetuning updates all model parameters. LoRA injects and trains small, low-rank adapter matrices. QLoRA quantizes the base model to 4-bit (NF4) and uses paged optimizers while still training LoRA adapters, drastically reducing VRAM. DoRA (Weight-Decomposed LoRA) further enhances LoRA by decomposing weight updates into magnitude and direction components, often achieving better performance while retaining efficiency.	\N
422	Generative AI Engineer (GenAI)	Python	System Design	Why QLoRA uses NF4 quantization?	hard	{"System Design",Fundamentals}	QLoRA utilizes NF4 (NormalFloat4) quantization because it's a data-type-aware 4-bit floating-point format that is empirically optimal for normally distributed weights, which are common in pre-trained neural networks. NF4 preserves more information and provides better quantization fidelity compared to standard 4-bit integer or floating-point quantization, crucial for maintaining model performance during LoRA fine-tuning on highly compressed base models.	\N
423	Generative AI Engineer (GenAI)	Python	System Design	What is gradient checkpointing?	hard	{"System Design",Fundamentals}	Gradient checkpointing is a memory-saving technique that trades recomputation for memory. Instead of storing all intermediate activations during the forward pass for backpropagation (which consumes vast memory), it only stores a few selected activations. The necessary intermediate activations are recomputed on the fly during the backward pass, enabling the training of much larger models that would otherwise exceed GPU memory limits.	import torch\nfrom torch.utils.checkpoint import checkpoint\n\n# Wrap a layer with checkpoint for memory saving\n# x = checkpoint(my_layer, x)
424	Generative AI Engineer (GenAI)	Python	System Design	How do you handle catastrophic forgetting in fine-tuned LLMs?	hard	{"System Design",Fundamentals}	Catastrophic forgetting occurs when fine-tuning an LLM on new data causes it to lose previously learned knowledge. Mitigation strategies include: using regularization (e.g., L2, dropout), interleaved training with a mix of old and new data, employing parameter-efficient fine-tuning (PEFT) methods like LoRA (which only updates a small subset of parameters), or knowledge distillation to retain prior knowledge.	\N
425	Generative AI Engineer (GenAI)	Python	System Design	Explain distributed training (DDP) vs FSDP vs ZeRO-Offload.	hard	{"System Design",Fundamentals,Python}	DDP (Distributed Data Parallel) replicates the model on each GPU and averages gradients. FSDP (Fully Sharded Data Parallel) shards model parameters, gradients, and optimizer states across GPUs, allowing much larger models to fit. ZeRO-Offload extends FSDP/ZeRO by offloading optimizer states and/or gradients to CPU/NVMe memory, further reducing GPU memory footprint for extremely large models or resource-constrained environments.	\N
426	Generative AI Engineer (GenAI)	Python	System Design	How to train long-context models? (positional interpolation, NTK scaling, YaRN)	hard	{"System Design",Fundamentals}	Training long-context models involves techniques to extend effective context window beyond pre-training limits. Positional Interpolation rescales positional embeddings to longer contexts. NTK (Neural Tangent Kernel) scaling dynamically adjusts attention scores by modifying the base of rotary positional embeddings. YaRN (Yet another RoPE variant) combines RoPE with a tailored NTK-like scaling, offering robust extrapolation to much longer contexts by modifying the frequency and magnitude of the positional encodings.	\N
427	Generative AI Engineer (GenAI)	Python	System Design	How to detect and fix model overfitting in LLM training?	hard	{"System Design",Fundamentals}	Overfitting is detected by a significant divergence between training loss/accuracy (improving) and validation loss/accuracy (stalling or worsening). Fixes include: applying regularization (e.g., dropout, weight decay), early stopping based on validation metrics, increasing data diversity or size, reducing model capacity (if possible), or utilizing parameter-efficient fine-tuning methods like LoRA which inherently limit the trainable parameters.	\N
428	Generative AI Engineer (GenAI)	Python	Fundamentals	Why do LLMs hallucinate? Deep technical explanation.	hard	{Fundamentals}	LLM hallucination stems from several technical factors: their autoregressive nature (next-token prediction), over-reliance on internal representations rather than factual grounding, training data biases/noise, out-of-distribution inputs, and the objective function prioritizing fluency and plausibility over factual accuracy. Essentially, the model is optimized to generate coherent text, and sometimes that coherent text isn't factually aligned with reality or its training data.	\N
429	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain chain-of-thought prompting and why it works.	medium	{Fundamentals}	Chain-of-Thought (CoT) prompting involves instructing the LLM to articulate intermediate reasoning steps before providing a final answer. It works by guiding the model through a multi-step logical process, similar to human problem-solving, which improves its ability to perform complex reasoning tasks, increases transparency, and often leads to more accurate and reliable outputs by explicitly constructing a rationale.	\N
430	Generative AI Engineer (GenAI)	Python	System Design	How to implement guardrails with LLMs? (Regex, LLM-as-judge, policy engines)	hard	{"System Design",Python}	Implementing guardrails involves using external mechanisms to control LLM behavior. Regex can block specific patterns (e.g., PII). An 'LLM-as-judge' employs a separate, potentially smaller LLM to evaluate the primary LLM's output against predefined rules. Policy engines (like NeMo Guardrails) provide structured frameworks to define and enforce complex, multi-turn dialogue policies, content safety rules, and conditional logic, ensuring outputs align with desired safety and operational guidelines.	\N
431	Generative AI Engineer (GenAI)	Python	System Design	What is prompt injection? How to defend against it?	hard	{"System Design",Fundamentals,Python}	Prompt injection is a security vulnerability where malicious input in a user prompt bypasses or overrides the LLM's original instructions, causing unintended outputs or actions. Defenses include: input sanitization and filtering, using a 'meta-prompt' to enclose user input, instruction tuning with adversarial examples, separating instructions from user input, and employing external guardrails/validation layers to check outputs for adherence to safety and ethical guidelines.	\N
432	Generative AI Engineer (GenAI)	Python	Fundamentals	Temperature vs top-p vs top-k — effect on generation.	medium	{Fundamentals}	Temperature controls the randomness by scaling the logits before softmax: higher values make the output more diverse/random, lower values make it more deterministic. Top-k sampling restricts the next token choice to the k most probable tokens. Top-p (nucleus) sampling chooses from the smallest set of tokens whose cumulative probability exceeds 'p'. These methods balance creativity and coherence in LLM generations.	\N
454	Generative AI Engineer (GenAI)	Python	Fundamentals	What is Activation Recomputation?	hard	{Fundamentals,"System Design"}	Activation Recomputation (or gradient checkpointing) is a memory-saving technique where intermediate activations, usually stored during the forward pass for backpropagation, are discarded and recomputed on-the-fly during the backward pass. This trades increased computation time for significant memory reduction, allowing the training of much larger models that would otherwise cause Out-of-Memory errors.	
433	Generative AI Engineer (GenAI)	Python	System Design	Why do LLMs refuse certain answers? (Safety layers, filters, reward models)	hard	{"System Design",Fundamentals}	LLMs refuse certain answers due to integrated safety mechanisms: pre-processing filters on inputs and post-processing filters on outputs to detect harmful content. They are often fine-tuned on safety-aligned datasets. Crucially, Reinforcement Learning from Human/AI Feedback (RLHF/RLAIF) uses reward models trained to penalize unsafe, unethical, or harmful responses, aligning the LLM's behavior with safety guidelines and constitutional AI principles.	\N
434	Generative AI Engineer (GenAI)	Python	System Design	How to measure LLM evaluation metrics (BLEU, BERTScore, Perplexity)?	hard	{"System Design",Fundamentals}	BLEU (Bilingual Evaluation Understudy) measures n-gram overlap with reference texts, penalizing shorter outputs. BERTScore uses contextual embeddings (from BERT) to calculate semantic similarity between candidate and reference sentences, overcoming n-gram limitations. Perplexity measures how well a language model predicts a sample of text, indicating its uncertainty; a lower perplexity generally means a more confident and accurate model.	\N
435	Generative AI Engineer (GenAI)	Python	Coding	How do you profile GPU memory usage in Python during LLM inference?	hard	{Python,Coding,"System Design"}	To profile GPU memory, use `nvidia-smi` or `pynvml` for real-time monitoring. Programmatically, PyTorch's `torch.cuda.memory_summary()` or `torch.cuda.max_memory_allocated()` provide detailed breakdowns per operation, crucial for identifying memory leaks or inefficient allocations during LLM inference.	import torch\n\n# Before inference\ninitial_memory = torch.cuda.memory_allocated()\n\n# Perform LLM inference\n...\n\n# After inference\nfinal_memory = torch.cuda.memory_allocated()\nmax_memory_used = torch.cuda.max_memory_allocated()\nprint(f"Initial: {initial_memory}, Final: {final_memory}, Max Used: {max_memory_used}")\nprint(torch.cuda.memory_summary())
436	Generative AI Engineer (GenAI)	Python	Fundamentals	Difference between multiprocessing Queue vs Manager vs Pipe in python-heavy workloads?	hard	{Python,Coding,Fundamentals,Async}	`multiprocessing.Queue` is a FIFO data structure for safe cross-process communication. `multiprocessing.Manager` provides shared objects (like dicts or lists) accessible by multiple processes via a server process. `multiprocessing.Pipe` offers a simpler, faster duplex connection for point-to-point communication between exactly two processes, often preferred for high-throughput data streams.	
437	Generative AI Engineer (GenAI)	Python	Coding	How to run multi-GPU inference with Python (torch distributed)?	hard	{Python,Coding,"System Design"}	Multi-GPU inference with `torch.distributed` primarily uses `DistributedDataParallel` (DDP) where each GPU gets a replica of the model and a slice of the batch. This allows parallel processing and efficient data distribution. For very large models, model parallelism might be used to shard layers across GPUs.	import torch.distributed as dist\nfrom torch.nn.parallel import DistributedDataParallel as DDP\nimport os\n\ndef setup(rank, world_size):\n    os.environ['MASTER_ADDR'] = 'localhost'\n    os.environ['MASTER_PORT'] = '12355'\n    dist.init_process_group("nccl", rank=rank, world_size=world_size)\n\n# Example usage in a distributed script (requires launching with torch.distributed.launch or torchrun)
438	Generative AI Engineer (GenAI)	Python	Async	How to implement async streaming inference API with FastAPI?	hard	{Python,Async,API,"System Design",Coding}	FastAPI enables async streaming using `async def` endpoints combined with `StreamingResponse` from `starlette.responses`. A generator function within the endpoint yields chunks of data (e.g., LLM tokens) as they become available, which FastAPI sends over the HTTP connection incrementally, optimizing for real-time user experience.	from fastapi import FastAPI\nfrom starlette.responses import StreamingResponse\nimport asyncio\n\napp = FastAPI()\n\nasync def generate_tokens():\n    for i in range(5):\n        yield f"token {i}\\n"\n        await asyncio.sleep(0.1)\n\n@app.get("/stream")\nasync def stream_inference():\n    return StreamingResponse(generate_tokens(), media_type="text/plain")
439	Generative AI Engineer (GenAI)	Python	System Design	Explain the design of a high-throughput token streaming server.	hard	{Python,"System Design",API,Async}	A high-throughput token streaming server leverages asynchronous I/O (e.g., FastAPI/Uvicorn) to manage many concurrent connections. It typically employs a request queue (e.g., Redis, Kafka) for load balancing and a pool of LLM inference workers (e.g., VLLM, Ray Serve) that process requests in batches. Outputs are streamed back to clients using Server-Sent Events (SSE) or WebSockets for real-time feedback.	
440	Generative AI Engineer (GenAI)	Python	Coding	How to optimize Python dataclasses and pydantic for LLM APIs?	hard	{Python,Coding,API,"System Design"}	Use Pydantic for robust data validation and serialization/deserialization in API request/response models, ensuring type safety and error handling; Pydantic v2's Rust-backed validators improve performance. `dataclasses` are faster for simple internal data structures where runtime validation overhead is not required, optimizing performance for common LLM API patterns.	from pydantic import BaseModel\nfrom dataclasses import dataclass\n\nclass LLMRequest(BaseModel):\n    prompt: str\n    max_tokens: int = 100\n\n@dataclass\nclass InternalToken:\n    text: str\n    log_prob: float
441	Generative AI Engineer (GenAI)	Python	Coding	How do you debug CUDA Out-of-Memory issues programmatically?	hard	{Python,Coding,"System Design"}	Programmatically debug OOM by using `torch.cuda.empty_cache()` to free unused memory, reducing batch sizes, or offloading model parts to CPU. `torch.cuda.memory_allocated()` and `torch.cuda.max_memory_allocated()` track memory spikes. Setting `CUDA_LAUNCH_BLOCKING=1` can provide more accurate stack traces at the cost of execution speed.	import torch\n\ntry:\n    # Model and data operations that might cause OOM\n    large_tensor = torch.randn(10000, 10000, device='cuda')\nexcept RuntimeError as e:\n    if "CUDA out of memory" in str(e):\n        print("CUDA OOM detected!")\n        print(f"Current allocated: {torch.cuda.memory_allocated() / 1024**2:.2f} MB")\n        print(f"Max allocated: {torch.cuda.max_memory_allocated() / 1024**2:.2f} MB")\n        torch.cuda.empty_cache()\n        print("Cleared CUDA cache. Retrying with smaller batch or offloading.")
455	Generative AI Engineer (GenAI)	Python	Fundamentals	Compare QLoRA vs LoRA vs DoRA vs AdaLoRA in depth.	hard	{Fundamentals,Coding}	`LoRA` injects low-rank matrices. `QLoRA` quantizes the base model to 4-bit while keeping LoRA weights full precision. `DoRA` disentangles weight magnitude and angle, applying LoRA to magnitude. `AdaLoRA` adaptively allocates LoRA rank based on importance, achieving efficiency with fewer parameters. Each offers increasing levels of memory efficiency and performance optimization over vanilla LoRA.	
442	Generative AI Engineer (GenAI)	Python	Coding	Write Python code to load a 4-bit quantized model and perform inference.	hard	{Python,Coding,Fundamentals}	Loading a 4-bit quantized model, often using `transformers` with `BitsAndBytesConfig`, significantly reduces GPU memory footprint by quantizing model weights while typically keeping LoRA adapters or computations in higher precision, enabling larger LLMs on consumer GPUs with minimal performance impact.	from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig\nimport torch\n\nmodel_id = "mistralai/Mistral-7B-Instruct-v0.2"\nbnb_config = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type="nf4",\n    bnb_4bit_compute_dtype=torch.bfloat16\n)\n\ntokenizer = AutoTokenizer.from_pretrained(model_id)\nmodel = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=bnb_config, device_map="auto")\n\nprompt = "What is the capital of France?"\ninputs = tokenizer(prompt, return_tensors="pt").to("cuda")\noutputs = model.generate(**inputs, max_new_tokens=50)\nprint(tokenizer.decode(outputs[0], skip_special_tokens=True))
443	Generative AI Engineer (GenAI)	Python	Coding	How do you profile CPU/GPU bottlenecks using PyTorch profiler?	hard	{Python,Coding,"System Design"}	PyTorch profiler (`torch.profiler.profile`) records detailed CPU and GPU execution times, memory usage, and CUDA kernel launches. It helps pinpoint bottlenecks, such as slow CPU data loading starving the GPU or expensive GPU operations, and visualizes traces (e.g., in TensorBoard) for actionable optimization insights.	import torch\nfrom torch.profiler import profile, schedule, tensorboard_trace_handler\n\nwith profile(schedule=schedule(wait=1, warmup=1, active=3, repeat=1),\n             on_trace_ready=tensorboard_trace_handler("./log/profiler"),\n             with_stack=True, profile_memory=True) as prof:\n    for _ in range(5):\n        # Your model forward/backward pass here\n        x = torch.randn(10, 10).cuda()\n        y = x @ x.T\n        z = y.sum()\n        prof.step()\nprint(prof.key_averages().table(sort_by="cuda_time_total", row_limit=10))
444	Generative AI Engineer (GenAI)	Python	System Design	Explain how to deploy Python-based LLM model on Kubernetes.	hard	{Python,"System Design",MLOps}	Deploying an LLM on Kubernetes involves containerizing the Python inference server (e.g., FastAPI) using Docker. This image is then deployed via Kubernetes deployments, services, and ingresses for scaling and load balancing. GPU support requires configuring node selectors and resource limits for NVIDIA GPUs within pods, typically managed by the NVIDIA device plugin.	
445	Generative AI Engineer (GenAI)	Python	Fundamentals	Why do long-context models require linear attention? Explain mathematically.	hard	{Fundamentals}	Standard self-attention has quadratic complexity O(N^2) with sequence length N, making long contexts computationally prohibitive. Linear attention mechanisms (e.g., Performer) re-factor the attention calculation, often by approximating softmax or using kernel functions, reducing complexity to O(N) to enable efficient processing of very long sequences.	
446	Generative AI Engineer (GenAI)	Python	Fundamentals	Compare Sliding Window Attention vs Local Attention vs BigBird.	hard	{Fundamentals,"System Design"}	`Sliding Window Attention` computes attention within a fixed window. `Local Attention` is similar but often implies fixed blocks. `BigBird` combines global attention (to a few key tokens), local attention (sliding window), and random attention (sparse connections) to achieve O(N) complexity with improved global context retention for very long sequences.	
447	Generative AI Engineer (GenAI)	Python	Fundamentals	How does Multi-Query Attention reduce memory?	hard	{Fundamentals,"System Design"}	Multi-Query Attention (MQA) reduces memory by sharing the Key (K) and Value (V) projection matrices across all attention heads, while keeping separate Query (Q) matrices. This significantly cuts down the memory required for storing KV caches, which is a major bottleneck in LLM inference, especially when batching multiple requests.	
448	Generative AI Engineer (GenAI)	Python	Fundamentals	Why KV Cache grows linearly with sequence length?	hard	{Fundamentals,"System Design"}	During auto-regressive decoding, each newly generated token must attend to all previous tokens and the initial prompt. The Key and Value vectors for all past tokens must be stored to compute attention for the current token. As the sequence grows, new KV pairs are appended, leading to a linear increase in memory: O(N * num_layers * num_heads * head_dim).	
449	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain multi-headed attention failure modes.	hard	{Fundamentals}	Multi-headed attention can fail if heads become redundant, learning similar patterns instead of diverse relationships. It can also struggle if heads over-specialize, missing broader context, or if poor training leads to attention weights collapsing to trivial patterns, hindering effective information flow and model robustness.	
450	Generative AI Engineer (GenAI)	Python	Fundamentals	Why do transformers struggle to extrapolate long patterns?	hard	{Fundamentals}	Transformers struggle to extrapolate long patterns beyond their training context primarily because fixed positional encodings limit their ability to generalize to unseen longer sequences. Without advanced techniques like RoPE or ALiBi, the model's learned positional relationships break down, preventing effective processing of extended contexts.	
451	Generative AI Engineer (GenAI)	Python	System Design	Explain model parallelism vs pipeline parallelism.	hard	{"System Design",Fundamentals}	`Model parallelism` shards a single model's layers across multiple devices, where each device holds a part of the model. `Pipeline parallelism` divides the model into sequential stages, with each device processing a different stage of a mini-batch. This allows multiple mini-batches to be processed concurrently in a pipeline fashion, improving throughput by overlapping computation and communication.	
452	Generative AI Engineer (GenAI)	Python	Fundamentals	What are residual streams? Explain how knowledge flows through them.	hard	{Fundamentals}	Residual streams are the direct skip connections in a Transformer that add the output of a sub-layer (attention or feed-forward) to its input. They serve as an 'information highway,' allowing gradients to propagate easily and enabling the model to retain and propagate learned features across many deep layers, preventing degradation and facilitating efficient knowledge flow.	
453	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain RMSNorm vs LayerNorm — which is better for LLMs?	hard	{Fundamentals}	`LayerNorm` normalizes inputs by shifting and scaling across the feature dimension, while `RMSNorm` (Root Mean Square Normalization) only scales inputs based on their root mean square, without recentering. RMSNorm is often preferred for LLMs due to its computational efficiency and comparable or better performance, offering more stable training and reduced complexity.	
456	Generative AI Engineer (GenAI)	Python	Fundamentals	Why transformer finetuning is memory-heavy?	hard	{Fundamentals,"System Design"}	Transformer fine-tuning is memory-heavy due to storing model parameters, optimizer states (e.g., Adam adds two states per parameter), and intermediate activations during the forward pass for gradient computation. The attention mechanism's quadratic memory footprint for activations also significantly contributes, especially with large batch sizes and long sequence lengths.	
457	Generative AI Engineer (GenAI)	Python	Fundamentals	How gradient accumulation works internally?	hard	{Fundamentals,Coding}	Gradient accumulation defers the optimizer step by summing gradients over several mini-batches before applying a single weight update. Instead of calling `optimizer.step()` after each batch, gradients are accumulated (`loss.backward()`) and the optimizer is stepped only after a specified number of accumulation steps, effectively simulating a larger batch size without increased memory.	for i, batch in enumerate(dataloader):\n    loss = model(batch)\n    loss.backward()\n    if (i + 1) % gradient_accumulation_steps == 0:\n        optimizer.step()\n        optimizer.zero_grad()\n# Ensure final step if batches aren't a multiple of accumulation steps
458	Generative AI Engineer (GenAI)	Python	Fundamentals	How do you choose rank for LoRA?	hard	{Fundamentals,Coding}	Choosing the LoRA rank (`r`) involves a trade-off: higher ranks increase capacity and potentially performance but also trainable parameters and memory. A common heuristic is to start with a small rank (e.g., 4, 8, 16) and incrementally increase it while monitoring validation performance, as relatively small ranks are often sufficient due to LLMs' low intrinsic dimensionality.	
459	Generative AI Engineer (GenAI)	Python	Fundamentals	What are adapters and why they’re used in parameter-efficient training?	hard	{Fundamentals}	Adapters are small, task-specific neural modules (typically a down-projection, non-linearity, and up-projection) inserted into pre-trained model layers. They are used in parameter-efficient training to fine-tune a model for new tasks by training only these small modules while keeping the base model frozen, significantly reducing trainable parameters and storage per task.	
460	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain bias-only fine-tuning.	hard	{Fundamentals,Coding}	Bias-only fine-tuning involves training exclusively the bias terms of a pre-trained model's layers while freezing all weight matrices. This extremely parameter-efficient method, though less powerful than LoRA or full fine-tuning, offers a fast and cheap way to adapt a model to specific domain shifts or simpler tasks, particularly when data is limited.	for name, param in model.named_parameters():\n    if 'bias' in name:\n        param.requires_grad = True\n    else:\n        param.requires_grad = False
461	Generative AI Engineer (GenAI)	Python	Fundamentals	Why instruction-tuning is needed for closed loopholes?	hard	{Fundamentals,"System Design"}	Instruction tuning trains LLMs on diverse tasks formatted as natural language instructions, enabling them to follow novel instructions at inference time. It is crucial for 'closing loopholes' by improving models' generalization to unseen prompts, aligning with user intent, and producing desired outputs even when prompts are ambiguous or adversarial, thus enhancing robustness and safety.	
462	Generative AI Engineer (GenAI)	Python	Coding	How to modify a model’s tokenizer without retraining from scratch?	hard	{Python,Coding,Fundamentals}	You can modify a tokenizer by adding new tokens (e.g., special tokens, domain-specific keywords) using `tokenizer.add_tokens()` or `tokenizer.add_special_tokens()`. This requires resizing the model's embedding layer (`model.resize_token_embeddings()`) to accommodate the new vocabulary without retraining the entire model, often initializing new embeddings randomly.	from transformers import AutoTokenizer, AutoModelForCausalLM\n\ntokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")\nmodel = AutoModelForCausalLM.from_pretrained("bert-base-uncased")\n\nnew_tokens = ["[DOC]", "[/DOC]"]\ntokenizer.add_tokens(new_tokens)\nmodel.resize_token_embeddings(len(tokenizer))\n\nprint(f"New vocabulary size: {len(tokenizer)}")
463	Generative AI Engineer (GenAI)	Python	Fundamentals	Why do we freeze certain layers during fine-tuning?	hard	{Fundamentals,"System Design"}	Freezing layers during fine-tuning (e.g., lower layers of a pre-trained model) preserves general, transferable knowledge learned during pre-training, preventing catastrophic forgetting. It also reduces the number of trainable parameters, making fine-tuning more memory-efficient and faster, especially for smaller datasets or when only minor adaptation is needed.	for param in model.base_model.parameters():\n    param.requires_grad = False\n# Only specific layers or adapter weights will be trainable
464	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain how PEFT harms or preserves base model knowledge.	hard	{Fundamentals,"System Design"}	PEFT generally `preserves` base model knowledge by keeping most pre-trained weights frozen, preventing catastrophic forgetting. However, if the PEFT method or chosen rank is too low, it might `harm` performance by limiting the model's capacity to adapt to task-specific nuances, potentially leading to underfitting or suboptimal results compared to full fine-tuning.	
465	Generative AI Engineer (GenAI)	Python	Fundamentals	Why is vector dimensionality reduction important? PCA vs SVD vs Autoencoders?	hard	{Fundamentals,"System Design"}	Dimensionality reduction is crucial for faster vector search, reduced storage, and mitigating the 'curse of dimensionality,' improving embedding density and semantic quality. `PCA` and `SVD` are linear methods for finding orthogonal components explaining variance. `Autoencoders` are non-linear neural networks learning compact representations, capturing complex relationships but requiring more resources.	
466	Generative AI Engineer (GenAI)	Python	Fundamentals	How do you merge multi-modal embeddings?	hard	{Fundamentals,"System Design"}	Multi-modal embeddings can be merged via `concatenation` (simplest, increases dimensionality), `summation/averaging` (reduces dimensionality, might lose info), or `learned fusion`. Learned fusion uses neural networks (e.g., attention-based) to project concatenated embeddings into a joint space, allowing the model to weigh modalities effectively, depending on the task and data.	
467	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain how HNSW graph search works internally.	hard	{Fundamentals,"System Design"}	HNSW (Hierarchical Navigable Small World) builds a multi-layer graph where higher layers have fewer nodes but larger connection ranges for coarse searches, while lower layers offer denser connections for fine-grained search. Querying starts at the top layer, navigating quickly to a rough neighborhood, then proceeds downwards, refining the search until nearest neighbors are found, balancing speed and accuracy.	
468	Generative AI Engineer (GenAI)	Python	Fundamentals	When does vector search fail semantically?	hard	{Fundamentals,"System Design"}	Vector search fails semantically when embeddings inaccurately capture meaning due to `polysemy` (multiple meanings), `out-of-domain` queries/documents, `rare entities` not well-represented, or `syntactic differences` where semantically similar phrases have disparate vectors. These issues arise from limitations in embedding model training or biases in the data.	
469	Generative AI Engineer (GenAI)	Python	Fundamentals	Why do we chunk by semantic boundaries, not character boundaries?	hard	{Fundamentals,"System Design"}	Chunking by semantic boundaries (e.g., paragraphs, sentences, sections) ensures each retrieved chunk contains a complete, coherent piece of information, preserving context. Character or fixed-size token chunking risks splitting sentences or ideas, leading to fragmented context and reduced relevance, which significantly harms RAG performance by providing incomplete answers.	
470	Generative AI Engineer (GenAI)	Python	Fundamentals	What is document expansion in RAG? (HyDE, self-query, etc.)	hard	{Fundamentals,"System Design"}	Document expansion in RAG enhances queries or documents to improve retrieval. `HyDE` (Hypothetical Document Embeddings) generates a hypothetical answer to the query, using its embedding for retrieval. `Self-query` involves an LLM dynamically re-writing or augmenting the user's query with additional context or keywords to target the vector store more effectively, leading to more precise retrieval.	
471	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain cross-encoder vs bi-encoder ranking.	hard	{Fundamentals,"System Design"}	`Bi-encoders` independently encode queries and documents into separate vectors, then compute similarity. They are fast for retrieval (pre-compute document embeddings). `Cross-encoders` take both query and document as input to a single transformer model, allowing deeper, contextualized interaction and higher ranking accuracy, typically used as a re-ranker due to higher computational cost.	
472	Generative AI Engineer (GenAI)	Python	System Design	Explain indexing strategies for 10M+ embedding documents.	hard	{"System Design",Fundamentals}	For 10M+ embeddings, employ Approximate Nearest Neighbor (ANN) indices like HNSW, IVF_FLAT, or ScaNN, often within vector databases (e.g., Milvus, Pinecone, Qdrant) that handle distributed indexing, partitioning, and storage. Strategies include batch processing for indexing, parallel writes, and memory-mapped files to optimize performance and stability for large-scale embedding collections.	
473	Generative AI Engineer (GenAI)	Python	System Design	How to design a hybrid semantic search pipeline?	hard	{"System Design",Fundamentals}	A hybrid semantic search pipeline combines lexical search (e.g., BM25 for keyword matching) with semantic vector search. It typically queries both systems in parallel, then merges and re-ranks the results using methods like Reciprocal Rank Fusion (RRF) or a cross-encoder. This approach leverages the strengths of both, improving both recall (from lexical) and precision (from semantic context).	
474	Generative AI Engineer (GenAI)	Python	System Design	How to reduce hallucination using multi-step RAG?	hard	{"System Design",Fundamentals}	Multi-step RAG reduces hallucination by iteratively refining the query and retrieval process. An initial query retrieves context, which the LLM then analyzes to formulate follow-up queries, synthesize information across multiple sources, or critically evaluate retrieved facts before generating a final answer, creating a more robust and verifiable output.	
475	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain perplexity mathematically — why low perplexity ≠ good reasoning?	hard	{Fundamentals}	Perplexity is the exponentiated average negative log-likelihood of a sequence: `exp( - (1/N) * sum(log P(token_i | context_i)) )`. A low perplexity indicates a model is good at predicting the next word, but doesn't guarantee good reasoning. A model can be fluent and have low perplexity while generating factually incorrect or illogical content.	
476	Generative AI Engineer (GenAI)	Python	Fundamentals	What is “reward hacking” in RLHF?	hard	{Fundamentals,"System Design"}	Reward hacking in RLHF occurs when the LLM exploits flaws or shortcuts in the reward model to maximize its predicted reward, without actually improving the desired behavior or intent. This leads to degenerate or nonsensical outputs that trick the reward model but don't align with human preferences, undermining the alignment process.	
477	Generative AI Engineer (GenAI)	Python	System Design	How to evaluate chain-of-thought reasoning quality automatically?	hard	{"System Design",Fundamentals}	Automatic CoT reasoning evaluation can use an 'LLM-as-a-judge' to score logical steps and final answers against rubrics or ground truth. Alternatively, structural metrics can detect specific reasoning patterns. For tasks with verifiable steps, each intermediate step's correctness can be checked against a golden path for objective assessment.	
478	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain adversarial prompting & jailbreak detection.	hard	{Fundamentals,"System Design"}	`Adversarial prompting` involves crafting inputs to elicit undesirable LLM behavior (e.g., harmful content). `Jailbreak detection` aims to identify such prompts using heuristic rules, sentiment analysis, fine-tuned classifiers (traditional ML or another LLM), or anomaly detection to flag suspicious patterns before they reach the main LLM, ensuring safety.	
479	Generative AI Engineer (GenAI)	Python	System Design	How to build a safety classifier for prompt moderation?	hard	{"System Design",Fundamentals}	Build a safety classifier using a pre-trained text classification model (e.g., BERT, RoBERTa, or a fine-tuned small LLM) specifically trained on a dataset of labeled safe and unsafe prompts. This model analyzes incoming prompts for harmful content, hate speech, or inappropriate language, flagging or rejecting those exceeding a predefined safety threshold before LLM processing.	
480	Generative AI Engineer (GenAI)	Python	System Design	Difference between rule-based vs LLM-as-a-judge evaluation.	hard	{"System Design",Fundamentals}	`Rule-based evaluation` uses predefined patterns, keywords, or explicit logic, offering transparency but limited flexibility. `LLM-as-a-judge evaluation` uses another (often larger) LLM to assess responses based on open-ended criteria, offering human-like judgment and adaptability to complex tasks, but can inherit biases from the judging LLM.	
481	Generative AI Engineer (GenAI)	Python	System Design	How to detect model hallucination using confidence scores?	hard	{"System Design",Fundamentals}	Detect hallucination by examining the LLM's token-level confidence scores (e.g., softmax probabilities). Low confidence in generated tokens, especially for factual claims, can signal potential hallucination. Ensemble methods or comparing confidence across multiple models can also identify discrepancies, though high confidence doesn't always guarantee factual accuracy.	
482	Generative AI Engineer (GenAI)	Python	Fundamentals	Why LLMs fail at multi-step math problem solving?	hard	{Fundamentals}	LLMs struggle with multi-step math because they are pattern-matching systems, not symbolic reasoners. They can generate syntactically correct steps but lack true understanding of mathematical operations, struggling with variable binding, arithmetic precision, or maintaining state across multiple steps, leading to cumulative errors. CoT prompting helps, but the inherent symbolic limitation remains.	
483	Generative AI Engineer (GenAI)	Python	Fundamentals	What is adversarial suffix attack?	hard	{Fundamentals,"System Design"}	An adversarial suffix attack involves appending a specially crafted sequence of tokens (a "suffix") to a benign user prompt. This suffix, often generated via optimization, can steer the LLM to ignore safety guidelines and generate harmful or inappropriate content, effectively "jailbreaking" the model by exploiting vulnerabilities in its training or alignment.	
484	Generative AI Engineer (GenAI)	Python	Fundamentals	Explain reward model collapse.	hard	{Fundamentals,"System Design"}	Reward model collapse in RLHF occurs when the reward model becomes unable to differentiate between good and bad responses, assigning similar high scores to diverse outputs. This often happens if the reward model overfits to the training data or is updated too frequently/aggressively, leading to a flattening of the reward landscape, which in turn hinders the policy model's ability to learn desired behaviors.	
485	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about an ML project you led end-to-end. What challenges did you face and how did you solve them?	hard	{Fundamentals,Python,"System Design"}	I led a fraud detection model project, building custom feature engineering pipelines and deploying a real-time inference service. A key challenge was managing data drift between training and production, which I addressed by implementing automated monitoring for feature distributions and scheduled model retraining based on performance metrics.	\N
486	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time when you had to choose between multiple ML approaches. How did you decide?	medium	{Fundamentals,Python}	For a recommendation system, I evaluated matrix factorization vs. deep learning approaches. I chose matrix factorization initially due to its interpretability and lower computational cost for quick iteration, while setting up an A/B test to validate its performance against a baseline before investing in a more complex deep learning model.	\N
487	Machine Learning Engineer (ML)	Python	Behavioral	What’s a project that failed or didn’t meet expectations? What did you learn?	hard	{Fundamentals,Python}	A sentiment analysis project failed to meet accuracy goals because the training data didn't capture real-world linguistic nuances. I learned the critical importance of robust data collection and iterative user feedback loops, leading to a refined data annotation strategy and improved model performance in subsequent iterations.	\N
488	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you dealt with poor-quality or limited data. What did you do?	medium	{Fundamentals,Python}	When faced with limited labeled data for a new product, I implemented data augmentation techniques like synthetic data generation and noise injection. For poor quality, I collaborated with domain experts to define cleaning rules and used outlier detection methods to preprocess the dataset, significantly improving model robustness.	\N
489	Machine Learning Engineer (ML)	Python	Behavioral	Describe an instance where data distribution changed (concept drift). How did you detect and address it?	hard	{Fundamentals,Python}	I detected concept drift in a demand forecasting model when real-time prediction errors spiked. I implemented monitoring dashboards tracking key feature distributions and model residuals. To address it, I triggered an automated retraining pipeline with the latest data and adapted the model to emphasize recent trends.	\N
490	Machine Learning Engineer (ML)	Python	Behavioral	How have you handled disagreements with data scientists or analysts over data assumptions?	medium	{Fundamentals,Python}	I once disagreed with an analyst's assumption about missing data imputation. I proposed running parallel experiments with both assumptions and presenting the empirical impact on model performance. This data-driven approach facilitated a consensus and improved the final model's reliability.	\N
491	Machine Learning Engineer (ML)	Python	Behavioral	Explain a time when your model worked in offline metrics but failed in production. What went wrong?	hard	{Fundamentals,Python,"System Design"}	My recommendation model showed high offline recall but low user engagement in production due to a 'serving-training skew'. Features used during training were processed differently than during real-time inference. I built a unified feature store to ensure consistency, resolving the discrepancy and improving online performance.	\N
492	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time you optimized a model for latency, memory, or compute constraints.	hard	{Fundamentals,Python,"System Design"}	For an edge device application, I optimized a deep learning model for memory and latency. I applied quantization and pruning techniques, reducing the model size by 70% and inference time by 50% while maintaining acceptable accuracy, enabling its deployment on resource-constrained hardware.	\N
493	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a model you had to retrain, monitor, or debug in production.	hard	{Fundamentals,Python,"System Design"}	I managed a production fraud detection model that experienced a spike in false positives. I leveraged model monitoring tools to identify drift in input feature distributions. My debugging process involved analyzing recent data anomalies and implementing an automated retraining pipeline to adapt the model to the evolving fraud patterns.	\N
494	Machine Learning Engineer (ML)	Python	Behavioral	How have you explained complex ML concepts to non-technical stakeholders?	medium	{Fundamentals}	I regularly use analogies and focus on the business impact rather than technical jargon. For instance, explaining model confidence, I'd liken it to a 'weather forecast probability' rather than a softmax output, demonstrating how it directly translates to actionable business decisions.	\N
495	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a conflict with a PM, engineer, or researcher. How did you resolve it?	medium	{Fundamentals}	I had a conflict with a PM about feature prioritization. I listened actively to their business rationale, then presented data-backed insights on the technical complexity and potential impact of different features. We found a compromise that delivered significant value efficiently while managing technical debt.	\N
496	Machine Learning Engineer (ML)	Python	Behavioral	Describe a scenario where business requirements changed mid-project. What did you do?	medium	{Fundamentals}	Mid-project, requirements for a content moderation tool shifted from 'detection' to 'prevention'. I quickly reassessed the technical approach, communicated the scope change and timeline adjustments to stakeholders, and pivoted the model's objective from reactive classification to proactive risk scoring, successfully adapting the project.	\N
497	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you had to make a decision with incomplete information.	medium	{Fundamentals}	When deploying a new model, I lacked full visibility into its real-world performance under all edge cases. I decided to launch with a controlled A/B test, carefully monitoring key metrics and implementing a robust rollback plan, allowing us to gather critical data while minimizing risk.	\N
498	Machine Learning Engineer (ML)	Python	Behavioral	Describe a situation where baselines or metrics were unclear. How did you define them?	hard	{Fundamentals,Python}	For a novel ML application, baselines were non-existent. I initiated a collaboration with product and business teams to define clear, measurable success metrics tied to user behavior. We established a simple heuristic baseline first, then iteratively refined the metrics and benchmarks as we gathered more data and insights.	\N
499	Machine Learning Engineer (ML)	Python	Behavioral	Give an example of simplifying a problem that seemed overly complex.	medium	{Fundamentals}	A complex fraud detection problem initially involved numerous, highly correlated features. I simplified it by performing dimensionality reduction and focusing on a minimal set of highly discriminative features. This reduced model complexity, improved interpretability, and maintained performance, accelerating development and deployment.	\N
500	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you took initiative without being asked.	medium	{Fundamentals}	I noticed our ML inference pipeline had significant latency spikes due to inefficient data serialization. Without being prompted, I researched and prototyped using a more efficient format like Protocol Buffers, successfully reducing average inference time by 30% and improving overall system responsiveness.	\N
501	Machine Learning Engineer (ML)	Python	Behavioral	Describe a moment when you mentored someone on ML or engineering.	medium	{Fundamentals}	I mentored a junior engineer struggling with model debugging in a production environment. I guided them through setting up proper logging, using interpretability tools, and systematic hypothesis testing, empowering them to independently diagnose and resolve issues, fostering their growth in MLOps practices.	\N
502	Machine Learning Engineer (ML)	Python	Behavioral	Give an example of when you improved a system, pipeline, or model beyond initial expectations.	hard	{Fundamentals,Python,"System Design"}	I was tasked with building a basic anomaly detection system, but I proactively integrated a novel active learning component. This allowed the model to continuously improve with minimal human annotation, significantly exceeding initial accuracy targets and reducing manual effort by 25% over time.	\N
503	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a high-pressure deadline you had to meet.	medium	{Fundamentals}	I had to deploy a critical model update before a major product launch. I prioritized core functionalities, streamlined testing, and communicated progress constantly with the team. By focusing on essentials and ensuring robust deployment, I successfully delivered the update on time, contributing to a smooth launch.	\N
504	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time you had to quickly learn a new ML technique or framework.	medium	{Fundamentals,Python}	To integrate a novel graph neural network (GNN) for a social network analysis project, I rapidly learned PyTorch Geometric and GNN principles. I leveraged documentation, open-source examples, and built a proof-of-concept, quickly becoming proficient enough to integrate it into our production pipeline within weeks.	\N
505	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a situation where your team disagreed with your technical direction.	hard	{Fundamentals}	My team initially preferred a simpler model architecture, but I advocated for a more complex, state-of-the-art solution. I presented thorough research, benchmarked prototypes, and addressed their concerns about complexity and maintainability. Ultimately, the data-driven evidence convinced them, and we achieved superior performance with the chosen approach.	\N
506	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time you identified ethical issues or bias in a model. What did you do?	hard	{Fundamentals,Python}	I discovered a hiring recommendation model exhibited bias against certain demographic groups during fairness auditing. I used interpretability tools like SHAP to pinpoint biased features, then implemented re-sampling and re-weighting techniques on the training data, and introduced fairness metrics into the evaluation pipeline to mitigate the bias.	\N
507	Machine Learning Engineer (ML)	Python	Behavioral	How have you communicated risk around ML models to leadership?	hard	{Fundamentals}	I translate technical risks, such as concept drift or data quality issues, into potential business impacts like revenue loss or customer dissatisfaction. I quantify these risks where possible and present clear mitigation strategies, such as robust monitoring, phased rollouts, and human-in-the-loop processes, ensuring leadership understands trade-offs and has confidence in our approach.	\N
508	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you had to learn a new ML algorithm or framework quickly.	medium	{Python,Fundamentals,Behavioral}	I once needed to integrate a new real-time recommendation system using PyTorch and its ecosystem. I quickly familiarized myself with PyTorch's data loading, model definition, and distributed training paradigms by leveraging official documentation, community forums, and hands-on experimentation. This enabled me to prototype and deploy a baseline model within two weeks, accelerating the project timeline significantly.	
509	Machine Learning Engineer (ML)	Python	Behavioral	Describe a situation where you realized your understanding was wrong and had to correct yourself.	medium	{Python,Fundamentals,Behavioral}	Early in a project, I assumed a certain data preprocessing step (e.g., imputation) was robust, but later realized it introduced a subtle data leakage. By meticulously reviewing feature importance and running ablation studies, I identified the flaw. I then corrected the pipeline, leading to a more generalizable model and a deeper understanding of potential pitfalls in feature engineering.	
510	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about the most difficult bug you fixed in an ML pipeline.	hard	{Python,Fundamentals,Behavioral}	The most challenging bug involved a silent data corruption issue in a distributed training pipeline, where a rare race condition caused features to be misaligned with labels for a tiny fraction of data. I tracked it down by instrumenting data hashes at various stages of the pipeline and using a custom data integrity checker, ultimately resolving it with careful synchronization primitives and data versioning.	
511	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time when your model was giving inconsistent predictions. How did you investigate it?	medium	{Python,Fundamentals,Behavioral}	When a deployed model showed inconsistent predictions, I first checked for data drift or schema changes in production inputs versus training data. Next, I examined the model's inference environment for library mismatches or configuration discrepancies. Finally, I used interpretability tools like SHAP to compare feature contributions on consistent vs. inconsistent predictions, often revealing subtle data quality issues or edge cases.	
512	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about an experiment you ran that didn’t go as expected.	medium	{Python,Fundamentals,Behavioral}	I once ran an experiment to incorporate external data to boost model performance, but the results were negligible. Instead of abandoning it, I performed deeper error analysis, realizing the new data's features were highly correlated with existing ones, providing no novel information. This taught me the importance of thorough feature analysis and avoiding 'data for data's sake' without a clear hypothesis.	
513	Machine Learning Engineer (ML)	Python	System Design	Describe how you set up A/B testing for a model. Any challenges faced?	hard	{Python,"System Design",Behavioral}	For A/B testing, I define clear primary and secondary metrics (e.g., click-through rate, latency), establish appropriate control and treatment groups with randomized user assignment, and ensure sufficient sample size for statistical significance. A common challenge is managing potential spillover effects between groups, which I address through robust experimental design or cluster-based randomization.	
514	Machine Learning Engineer (ML)	Python	System Design	Tell me about a time you scaled an ML system for high traffic or large datasets.	hard	{Python,"System Design"}	I scaled a real-time fraud detection system from processing thousands to millions of requests per day. This involved migrating from a monolithic Flask app to a distributed microservice architecture using Kubernetes and implementing efficient data streaming with Kafka, optimizing model inference with ONNX runtime, and leveraging cloud-native auto-scaling for both compute and data storage.	
515	Machine Learning Engineer (ML)	Python	System Design	Describe a time you optimized a pipeline end-to-end. What gave the most improvement?	hard	{Python,"System Design",Fundamentals}	I optimized a batch prediction pipeline that processed daily customer data. The most significant improvement came from refactoring the feature engineering step, which was reading and processing redundant data from a slow database. By implementing a materialized view and optimizing SQL queries to only retrieve necessary delta updates, I reduced pipeline runtime by 60%, significantly improving freshness and resource utilization.	
516	Machine Learning Engineer (ML)	Python	Behavioral	How do you work with data engineers or MLOps engineers on pipeline issues?	medium	{Behavioral}	I collaborate closely with data and MLOps engineers by clearly defining data contracts, using shared tools like Jira for issue tracking, and co-debugging with screen shares. My approach emphasizes mutual understanding of each other's domain expertise and proactive communication to resolve issues swiftly and prevent recurrence, fostering a robust and reliable ML ecosystem.	
517	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you disagreed with your manager about a technical approach.	medium	{Behavioral}	I once disagreed on using a simpler model for a critical task, arguing for a slightly more complex, but demonstrably higher-performing, ensemble method. I presented data-driven evidence of the performance gap and explained the negligible increase in inference latency. We ultimately agreed to A/B test both, where my proposed approach proved superior, leading to its adoption.	
518	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time when you took responsibility for a production issue.	medium	{Behavioral}	A critical production model's performance degraded due to an unforeseen upstream data schema change. I immediately took ownership, led the root cause analysis, manually patched the affected data and model, and then implemented automated data validation checks and alert mechanisms to prevent future occurrences, ensuring full resolution and system resilience.	
519	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a situation where you had to push back on unrealistic deadlines.	medium	{Behavioral}	I once had a manager set an aggressive deadline for a new model feature. I explained, with a detailed breakdown of necessary research, data preparation, and experimentation, why the timeline was unrealistic for a high-quality, production-ready solution. I proposed a phased approach, delivering a functional MVP on the original deadline and the full feature iteratively, which was accepted.	
520	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you had to balance ML accuracy with business constraints.	hard	{Python,Fundamentals,Behavioral}	In a real-time recommendation system, achieving 99% accuracy came with unacceptable inference latency for user experience. I systematically evaluated models with varying complexities, opting for one with 97% accuracy that met the strict latency budget of 50ms. This demonstrated balancing technical perfection with user experience and business impact, clearly communicating the trade-offs to stakeholders.	
521	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time when your model insights influenced a product decision.	medium	{Python,Fundamentals,Behavioral}	My churn prediction model identified a segment of users with high churn risk who rarely used a specific, under-promoted feature. I presented these insights, showing that proactive engagement around this feature could significantly reduce churn. This directly led the product team to redesign the onboarding flow to highlight this feature, resulting in a measurable reduction in churn rates.	
594	Machine Learning Engineer (ML)	Python	System Design	Design an edge-ML deployment system (mobile/IoT).	medium	{"System Design",Python}	An edge-ML deployment system focuses on deploying highly optimized, small models (e.g., TensorFlow Lite, Core ML) for on-device inference, constrained by resources and connectivity. It includes mechanisms for secure model updates, data privacy compliance, handling intermittent network access, and remote monitoring of model performance and resource usage on edge devices.	\N
522	Machine Learning Engineer (ML)	Python	Behavioral	Give an example of when you had to choose between a simpler model and a complex one.	medium	{Python,Fundamentals,Behavioral}	For a fraud detection task, I chose a simpler Logistic Regression over a complex Gradient Boosting model. While the latter offered a 1% AUC lift, the business required high interpretability for regulatory compliance and faster inference times for real-time decisions. The simpler model provided sufficient performance, crucial transparency, and met strict latency requirements, making it the superior choice.	
523	Machine Learning Engineer (ML)	Python	System Design	Tell me about a time you had to reduce model inference cost.	hard	{Python,"System Design",Fundamentals}	To reduce inference cost for a high-traffic image classification model, I implemented model quantization (converting float32 to int8) using TensorFlow Lite, which shrunk model size by 75% and reduced CPU/GPU usage. Additionally, I optimized batching strategies on the serving side and explored model distillation to a smaller architecture, significantly cutting cloud computing expenses without sacrificing critical accuracy.	
524	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time when you mentored someone on ML best practices.	medium	{Behavioral}	I mentored a junior engineer on MLOps best practices, focusing on version control for models and data, automated testing, and CI/CD for ML pipelines. I guided them through setting up DVC for data versioning and integrating automated model retraining and deployment workflows, enabling them to confidently manage their ML projects with robust engineering standards.	
525	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you led a technical discussion or design meeting.	medium	{Behavioral,"System Design"}	I led a design meeting for integrating a new feature store into our ML platform. I prepared an agenda, presented different architectural options with their pros and cons (e.g., latency, cost, scalability), and facilitated a constructive discussion among data engineers and ML engineers. We collectively decided on a hybrid approach, leveraging existing infrastructure where possible while designing new components for real-time feature serving.	
526	Machine Learning Engineer (ML)	Python	Behavioral	Tell me about a time you invested a lot in a model but had to abandon the approach.	medium	{Python,Behavioral}	I spent months developing a complex deep learning model for a specialized recommendation task, hoping for significant performance gains. Despite extensive tuning, it consistently underperformed a much simpler baseline due to data sparsity issues inherent to the problem. I made the data-driven decision to abandon the deep learning approach, pivoting back to the simpler model and focusing on feature engineering, ultimately delivering a more robust and maintainable solution.	
527	Machine Learning Engineer (ML)	Python	Behavioral	Describe a time you received critical feedback on your technical work. How did you respond?	medium	{Behavioral}	I received feedback that my documentation for a new ML service was insufficient for wider team adoption. I actively listened to the specific points, acknowledged the validity, and asked clarifying questions. I then dedicated time to update the documentation with clearer examples, setup instructions, and troubleshooting guides, ensuring better onboarding and utility for my colleagues.	
528	Machine Learning Engineer (ML)	Python	Coding	Two Sum	easy	{Python,Coding,Fundamentals}	Solve Two Sum using a hash map to store numbers and their indices. Iterate through the array; for each number, check if 'target - number' exists in the map, ensuring O(n) time complexity.	def two_sum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return []
529	Machine Learning Engineer (ML)	Python	Coding	Merge Intervals	medium	{Python,Coding,Fundamentals}	Sort intervals by their start times. Iterate through the sorted list, merging overlapping intervals by extending the end time of the current merged interval if a subsequent interval overlaps.	def merge_intervals(intervals):\n    if not intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged
530	Machine Learning Engineer (ML)	Python	Coding	Sliding Window Maximum	hard	{Python,Coding,Fundamentals}	Utilize a deque to store indices of elements in decreasing order, maintaining the maximum at the front. As the window slides, remove elements outside the window and smaller than new elements from the deque.	from collections import deque\ndef sliding_window_maximum(nums, k):\n    if not nums: return []\n    dq = deque()\n    result = []\n    for i in range(len(nums)):\n        while dq and dq[0] < i - k + 1: dq.popleft()\n        while dq and nums[dq[-1]] < nums[i]: dq.pop()\n        dq.append(i)\n        if i >= k - 1: result.append(nums[dq[0]])\n    return result
531	Machine Learning Engineer (ML)	Python	Coding	Longest Substring Without Repeating Characters	medium	{Python,Coding,Fundamentals}	Employ a sliding window approach with a hash set to track characters within the current window. Expand the right pointer; if a character repeats, shrink the left pointer until the window is valid again, updating the maximum length.	def length_of_longest_substring(s):\n    char_set = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len
532	Machine Learning Engineer (ML)	Python	Coding	K Closest Points to Origin	medium	{Python,Coding,Fundamentals}	Use a min-heap (priority queue) to store points based on their squared Euclidean distance from the origin. Maintain the heap size to K, ensuring it always contains the K points closest to the origin.	import heapq\ndef k_closest_points(points, k):\n    heap = []\n    for x, y in points:\n        dist = -(x*x + y*y) # Max-heap for negative distance\n        if len(heap) < k:\n            heapq.heappush(heap, (dist, [x, y]))\n        elif dist > heap[0][0]: # If current point is closer than current max-distance in heap\n            heapq.heapreplace(heap, (dist, [x, y]))\n    return [p for dist, p in heap]
559	Machine Learning Engineer (ML)	Python	Coding	Implement Sampling with Replacement Manually	easy	{Python,Coding,Fundamentals}	Sampling with replacement manually involves repeatedly selecting an element from a population, recording it, and then returning it to the population before the next selection, allowing for the same element to be picked multiple times.	import random\ndef sample_with_replacement(population, k):\n    n = len(population)\n    samples = []\n    for _ in range(k):\n        random_index = random.randint(0, n - 1)\n        samples.append(population[random_index])\n    return samples
533	Machine Learning Engineer (ML)	Python	Coding	Binary Tree Level Order Traversal	medium	{Python,Coding,Fundamentals}	Perform a Breadth-First Search (BFS) using a queue. Add the root to the queue, then process nodes level by level, adding children to the queue for the next iteration.	from collections import deque\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None): self.val = val; self.left = left; self.right = right\ndef level_order_traversal(root):\n    if not root: return []\n    result, q = [], deque([root])\n    while q:\n        level_nodes = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level_nodes.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        result.append(level_nodes)\n    return result
534	Machine Learning Engineer (ML)	Python	Coding	Lowest Common Ancestor of a Binary Tree	medium	{Python,Coding,Fundamentals}	Recursively search for nodes `p` and `q`. If a node is `p` or `q`, or if `p` and `q` are found in its left and right subtrees respectively, then that node is the LCA.	class TreeNode:\n    def __init__(self, x): self.val = x; self.left = None; self.right = None\ndef lowest_common_ancestor(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lowest_common_ancestor(root.left, p, q)\n    right = lowest_common_ancestor(root.right, p, q)\n    if left and right: return root\n    return left if left else right
535	Machine Learning Engineer (ML)	Python	Coding	Top K Frequent Elements	medium	{Python,Coding,Fundamentals}	First, count element frequencies using a hash map. Then, use a min-heap (priority queue) of size K to store (frequency, element) pairs, ensuring only the K highest frequencies are retained.	import heapq\nfrom collections import Counter\ndef top_k_frequent(nums, k):\n    counts = Counter(nums)\n    return heapq.nlargest(k, counts.keys(), key=counts.get)
536	Machine Learning Engineer (ML)	Python	Coding	Implement LRU Cache	hard	{Python,Coding,Fundamentals}	Combine a dictionary for O(1) lookups and a doubly linked list to maintain item order by recency. On access, move the item to the front of the list; on insertion when full, remove the least recently used (tail) item.	from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity: int): self.cache = OrderedDict(); self.capacity = capacity\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity: self.cache.popitem(last=False)
537	Machine Learning Engineer (ML)	Python	Coding	Search in Rotated Sorted Array	medium	{Python,Coding,Fundamentals}	Apply a modified binary search. Determine which half of the array is sorted (left or right) by comparing `nums[mid]` with `nums[left]`. Then, check if the target lies within that sorted half to narrow the search.	def search_rotated_sorted_array(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target: return mid\n        if nums[left] <= nums[mid]: # Left half is sorted\n            if nums[left] <= target < nums[mid]: right = mid - 1\n            else: left = mid + 1\n        else: # Right half is sorted\n            if nums[mid] < target <= nums[right]: left = mid + 1\n            else: right = mid - 1\n    return -1
538	Machine Learning Engineer (ML)	Python	Coding	Linked List Cycle Detection	easy	{Python,Coding,Fundamentals}	Use Floyd's Tortoise and Hare algorithm: a slow pointer moves one step at a time, and a fast pointer moves two steps. If they meet, a cycle exists in the linked list.	class ListNode:\n    def __init__(self, x): self.val = x; self.next = None\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False
539	Machine Learning Engineer (ML)	Python	Coding	Number of Islands	medium	{Python,Coding,Fundamentals}	Iterate through the grid; upon finding a '1', increment island count and perform a BFS/DFS from that point to mark all connected '1's as visited ('0'), preventing re-counting.	from collections import deque\ndef num_islands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    num_islands = 0\n    def bfs(r, c):\n        q = deque([(r, c)])\n        grid[r][c] = '0'\n        while q:\n            row, col = q.popleft()\n            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:\n                nr, nc = row + dr, col + dc\n                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':\n                    grid[nr][nc] = '0'\n                    q.append((nr, nc))\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                num_islands += 1\n                bfs(r, c)\n    return num_islands
540	Machine Learning Engineer (ML)	Python	Coding	Word Break	medium	{Python,Coding,Fundamentals}	Use dynamic programming: `dp[i]` is true if `s[:i]` can be segmented into words from the dictionary. Iterate `j` from `0` to `i`, checking if `dp[j]` is true and `s[j:i]` is a valid word.	def word_break(s, word_dict):\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_dict:\n                dp[i] = True\n                break\n    return dp[len(s)]
541	Machine Learning Engineer (ML)	Python	Coding	Meeting Rooms II	medium	{Python,Coding,Fundamentals}	Sort meetings by start time. Use a min-heap to store the end times of ongoing meetings. For each new meeting, remove all meetings from the heap that have ended, then add the current meeting's end time. The maximum size of the heap is the minimum rooms required.	import heapq\ndef min_meeting_rooms(intervals):\n    if not intervals: return 0\n    intervals.sort(key=lambda x: x[0])\n    rooms = [] # Min-heap to store end times\n    heapq.heappush(rooms, intervals[0][1])\n    for i in range(1, len(intervals)):\n        if intervals[i][0] >= rooms[0]: # Current meeting can use an existing room\n            heapq.heappop(rooms)\n        heapq.heappush(rooms, intervals[i][1]) # Assign a room (new or reused)\n    return len(rooms)
542	Machine Learning Engineer (ML)	Python	Coding	Find Median from Data Stream	hard	{Python,Coding,Fundamentals}	Maintain two heaps: a max-heap for the lower half of numbers and a min-heap for the upper half. Ensure they are balanced (size differs by at most 1) to quickly retrieve the median from their top elements.	import heapq\nclass MedianFinder:\n    def __init__(self):\n        self.low = []  # Max-heap for lower half\n        self.high = [] # Min-heap for upper half\n    def addNum(self, num: int) -> None:\n        heapq.heappush(self.low, -num)\n        heapq.heappush(self.high, -heapq.heappop(self.low))\n        if len(self.high) > len(self.low): # Balance heaps\n            heapq.heappush(self.low, -heapq.heappop(self.high))\n    def findMedian(self) -> float:\n        if len(self.low) > len(self.high): return -self.low[0]\n        return (-self.low[0] + self.high[0]) / 2.0
543	Machine Learning Engineer (ML)	Python	Coding	Implement Gradient Descent from Scratch	medium	{Python,Coding,Fundamentals}	Gradient Descent iteratively updates model parameters (weights, bias) by moving in the direction opposite to the gradient of the cost function, scaled by a learning rate, to minimize loss. This involves calculating the gradient for each parameter and updating them simultaneously.	import numpy as np\ndef gradient_descent(X, y, learning_rate=0.01, epochs=100):\n    m, n = X.shape\n    weights = np.zeros(n)\n    bias = 0\n    for _ in range(epochs):\n        predictions = np.dot(X, weights) + bias\n        errors = predictions - y\n        # Update weights and bias\n        weights -= learning_rate * (1/m) * np.dot(X.T, errors)\n        bias -= learning_rate * (1/m) * np.sum(errors)\n    return weights, bias
544	Machine Learning Engineer (ML)	Python	Coding	Implement Logistic Regression Training (no libraries)	medium	{Python,Coding,Fundamentals}	Implement logistic regression by defining the sigmoid activation function and cross-entropy loss. Train it using gradient descent, iteratively updating weights and bias based on the partial derivatives of the loss with respect to these parameters.	import numpy as np\ndef sigmoid(z): return 1 / (1 + np.exp(-z))\ndef logistic_regression(X, y, lr=0.01, epochs=1000):\n    m, n = X.shape\n    weights = np.zeros(n)\n    bias = 0\n    for _ in range(epochs):\n        linear_model = np.dot(X, weights) + bias\n        y_predicted = sigmoid(linear_model)\n        dw = (1/m) * np.dot(X.T, (y_predicted - y))\n        db = (1/m) * np.sum(y_predicted - y)\n        weights -= lr * dw\n        bias -= lr * db\n    return weights, bias
545	Machine Learning Engineer (ML)	Python	Coding	Implement K-Means Clustering	medium	{Python,Coding,Fundamentals}	K-means works iteratively: initialize K centroids, assign each data point to its closest centroid, then update each centroid to be the mean of its assigned points. Repeat until centroids no longer significantly change.	import numpy as np\ndef euclidean_distance(x1, x2): return np.sqrt(np.sum((x1 - x2)**2))\ndef k_means(X, k, max_iters=100):\n    centroids = X[np.random.choice(X.shape[0], k, replace=False)]\n    for _ in range(max_iters):\n        clusters = [[] for _ in range(k)]\n        for x_idx, x in enumerate(X):\n            distances = [euclidean_distance(x, centroid) for centroid in centroids]\n            closest_centroid = np.argmin(distances)\n            clusters[closest_centroid].append(x_idx)\n        new_centroids = np.array([np.mean(X[cluster], axis=0) if cluster else centroids[i] for i, cluster in enumerate(clusters)])\n        if np.allclose(centroids, new_centroids): break\n        centroids = new_centroids\n    return centroids, clusters
546	Machine Learning Engineer (ML)	Python	Coding	Implement Forward Pass of a Neural Network	medium	{Python,Coding,Fundamentals}	The forward pass involves computing the weighted sum of inputs for each layer (linear transformation), followed by applying an activation function (e.g., ReLU, Sigmoid). This process propagates activations from the input layer through hidden layers to the output layer.	import numpy as np\ndef relu(x): return np.maximum(0, x)\ndef softmax(x): return np.exp(x) / np.sum(np.exp(x), axis=0)\ndef forward_pass(X, weights_h, bias_h, weights_o, bias_o):\n    # Hidden layer\n    hidden_layer_input = np.dot(weights_h, X) + bias_h\n    hidden_layer_output = relu(hidden_layer_input)\n    # Output layer\n    output_layer_input = np.dot(weights_o, hidden_layer_output) + bias_o\n    output = softmax(output_layer_input)\n    return output
547	Machine Learning Engineer (ML)	Python	Coding	Implement Backpropagation (simple 2-layer NN)	hard	{Python,Coding,Fundamentals}	Backpropagation calculates gradients of the loss with respect to each weight and bias by propagating error signals backward through the network, applying the chain rule. This enables weight updates via gradient descent to minimize the loss function.	import numpy as np\ndef sigmoid(z): return 1 / (1 + np.exp(-z))\ndef sigmoid_derivative(z): return sigmoid(z) * (1 - sigmoid(z))\ndef backpropagation(X, y, weights_h, bias_h, weights_o, bias_o, lr=0.01):\n    # Forward pass\n    Z1 = np.dot(weights_h, X) + bias_h\n    A1 = sigmoid(Z1)\n    Z2 = np.dot(weights_o, A1) + bias_o\n    A2 = sigmoid(Z2) # Output layer activation\n    # Backward pass\n    dZ2 = A2 - y # Derivative of loss wrt Z2 for binary cross-entropy\n    dW2 = np.dot(dZ2, A1.T)\n    db2 = np.sum(dZ2, axis=1, keepdims=True)\n    dZ1 = np.dot(weights_o.T, dZ2) * sigmoid_derivative(Z1)\n    dW1 = np.dot(dZ1, X.T)\n    db1 = np.sum(dZ1, axis=1, keepdims=True)\n    # Update weights and biases\n    weights_o -= lr * dW2\n    bias_o -= lr * db2\n    weights_h -= lr * dW1\n    bias_h -= lr * db1\n    return weights_h, bias_h, weights_o, bias_o
548	Machine Learning Engineer (ML)	Python	Coding	Write Code to Compute Confusion Matrix	easy	{Python,Coding,Fundamentals}	A confusion matrix counts True Positives, True Negatives, False Positives, and False Negatives by comparing predicted labels against true labels. This provides a detailed breakdown of classification model performance.	def compute_confusion_matrix(y_true, y_pred, positive_label=1):\n    tp = tn = fp = fn = 0\n    for true, pred in zip(y_true, y_pred):\n        if true == positive_label and pred == positive_label: tp += 1\n        elif true != positive_label and pred != positive_label: tn += 1\n        elif true != positive_label and pred == positive_label: fp += 1\n        else: fn += 1\n    return {'TP': tp, 'TN': tn, 'FP': fp, 'FN': fn}
549	Machine Learning Engineer (ML)	Python	Coding	Implement a Decision Tree Split (Information Gain / Gini)	medium	{Python,Coding,Fundamentals}	To implement a decision tree split, iterate through features and possible split points. For each potential split, calculate a metric like Information Gain (using entropy) or Gini impurity. Choose the split that maximizes gain or minimizes impurity.	import numpy as np\ndef gini_impurity(labels):\n    if len(labels) == 0: return 0\n    probs = [np.sum(labels == c) / len(labels) for c in np.unique(labels)]\n    return 1 - np.sum(np.array(probs)**2)\n\ndef find_best_split(X, y):\n    best_gini = float('inf')\n    best_feature_idx = best_threshold = None\n    for feature_idx in range(X.shape[1]):\n        thresholds = np.unique(X[:, feature_idx])\n        for threshold in thresholds:\n            left_mask = X[:, feature_idx] <= threshold\n            y_left, y_right = y[left_mask], y[~left_mask]\n            gini_left, gini_right = gini_impurity(y_left), gini_impurity(y_right)\n            weighted_gini = (len(y_left)/len(y)) * gini_left + (len(y_right)/len(y)) * gini_right\n            if weighted_gini < best_gini:\n                best_gini = weighted_gini\n                best_feature_idx, best_threshold = feature_idx, threshold\n    return best_feature_idx, best_threshold, best_gini
579	Machine Learning Engineer (ML)	Python	System Design	Design a data labeling pipeline for supervised learning.	medium	{"System Design",Python}	A data labeling pipeline involves strategic data sampling, a user-friendly labeling interface (e.g., custom tool, crowd-sourcing platform), and robust quality control mechanisms (e.g., consensus, review process, golden sets). Active learning can be integrated to prioritize uncertain samples, optimizing labeling efficiency and ensuring high-quality, versioned datasets for supervised model training.	\N
550	Machine Learning Engineer (ML)	Python	Coding	Write Your Own Dataset Loader with Batching	medium	{Python,Coding,Fundamentals}	Create a Python class that acts as an iterable. In its `__iter__` method, load data, optionally shuffle it, and yield batches of data (e.g., `(features, labels)`) for use in training loops.	import numpy as np\nclass CustomDataLoader:\n    def __init__(self, data, labels, batch_size, shuffle=True):\n        self.data = np.array(data)\n        self.labels = np.array(labels)\n        self.batch_size = batch_size\n        self.shuffle = shuffle\n        self.indices = np.arange(len(self.data))\n    def __iter__(self):\n        if self.shuffle:\n            np.random.shuffle(self.indices)\n        for i in range(0, len(self.indices), self.batch_size):\n            batch_indices = self.indices[i:i + self.batch_size]\n            yield self.data[batch_indices], self.labels[batch_indices]\n    def __len__(self): return (len(self.data) + self.batch_size - 1) // self.batch_size
551	Machine Learning Engineer (ML)	Python	Coding	Implement Softmax with Numerical Stability	medium	{Python,Coding,Fundamentals}	Implement softmax by subtracting the maximum logit value from all logits before exponentiation. This prevents overflow/underflow issues when dealing with very large or very small numbers, ensuring numerical stability.	import numpy as np\ndef stable_softmax(x):\n    # Subtract max(x) for numerical stability\n    e_x = np.exp(x - np.max(x))\n    return e_x / e_x.sum(axis=0)
552	Machine Learning Engineer (ML)	Python	Coding	Implement a Simple Recommendation System (Cosine Similarity)	medium	{Python,Coding,Fundamentals}	A simple recommendation system using cosine similarity calculates the cosine of the angle between two item/user vectors. Items with higher cosine similarity to a user's preferences or other items are recommended, indicating higher resemblance.	import numpy as np\ndef cosine_similarity(vec1, vec2):\n    dot_product = np.dot(vec1, vec2)\n    norm_vec1 = np.linalg.norm(vec1)\n    norm_vec2 = np.linalg.norm(vec2)\n    if norm_vec1 == 0 or norm_vec2 == 0: return 0\n    return dot_product / (norm_vec1 * norm_vec2)\n\ndef recommend_items(user_profile, item_vectors, k=5):\n    similarities = []\n    for item_id, item_vec in enumerate(item_vectors):\n        sim = cosine_similarity(user_profile, item_vec)\n        similarities.append((sim, item_id))\n    similarities.sort(key=lambda x: x[0], reverse=True)\n    return [item_id for sim, item_id in similarities[:k]]
553	Machine Learning Engineer (ML)	Python	Fundamentals	Calculate Mean, Variance, and Standard Deviation Manually	easy	{Python,Coding,Fundamentals}	Mean is the sum of values divided by count. Variance measures the average of squared differences from the mean. Standard deviation is the square root of the variance, indicating data dispersion.	def calculate_stats(data):\n    n = len(data)\n    if n == 0: return 0, 0, 0\n    mean = sum(data) / n\n    variance = sum((x - mean) ** 2 for x in data) / n\n    std_dev = variance ** 0.5\n    return mean, variance, std_dev
554	Machine Learning Engineer (ML)	Python	Coding	Implement Matrix Multiplication	medium	{Python,Coding,Fundamentals}	Matrix multiplication involves iterating through rows of the first matrix and columns of the second. Each element in the resultant matrix is the dot product of a row from the first and a column from the second.	import numpy as np\ndef matrix_multiply(A, B):\n    if A.shape[1] != B.shape[0]: raise ValueError('Incompatible matrix dimensions')\n    C = np.zeros((A.shape[0], B.shape[1]))\n    for i in range(A.shape[0]):\n        for j in range(B.shape[1]):\n            for k in range(A.shape[1]):\n                C[i,j] += A[i,k] * B[k,j]\n    return C
555	Machine Learning Engineer (ML)	Python	Fundamentals	Compute Covariance and Correlation	medium	{Python,Coding,Fundamentals}	Covariance quantifies the joint variability of two variables, calculated as the average of the product of their deviations from their respective means. Correlation normalizes covariance, providing a standardized measure of linear relationship between -1 and 1.	import numpy as np\ndef compute_cov_corr(x, y):\n    n = len(x)\n    mean_x, mean_y = np.mean(x), np.mean(y)\n    # Covariance\n    covariance = np.sum((x - mean_x) * (y - mean_y)) / (n - 1)\n    # Correlation\n    std_x, std_y = np.std(x, ddof=1), np.std(y, ddof=1)\n    correlation = covariance / (std_x * std_y) if std_x * std_y != 0 else 0\n    return covariance, correlation
556	Machine Learning Engineer (ML)	Python	Coding	Implement PCA (using SVD)	hard	{Python,Coding,Fundamentals}	Principal Component Analysis (PCA) with SVD involves centering the data, then performing Singular Value Decomposition on the data matrix. The right singular vectors (V) give the principal components, and singular values relate to the explained variance.	import numpy as np\ndef implement_pca(data, n_components):\n    # Center the data\n    data_centered = data - np.mean(data, axis=0)\n    # Perform SVD\n    U, S, Vt = np.linalg.svd(data_centered)\n    # Principal components are the first n_components columns of Vt.T\n    components = Vt.T[:, :n_components]\n    # Project data onto principal components\n    transformed_data = np.dot(data_centered, components)\n    return transformed_data, components
557	Machine Learning Engineer (ML)	Python	Coding	Generate a Normal Distribution without using numpy.random (Box–Muller)	hard	{Python,Coding,Fundamentals}	The Box-Muller transform generates two independent standard normal (Gaussian) random variables from two independent uniformly distributed random numbers. It uses trigonometric functions and logarithms for this transformation.	import math\nimport random\ndef box_muller():\n    # Generate two uniform random numbers (0, 1]\n    u1 = 0\n    while u1 == 0: u1 = random.random() # Avoid log(0)\n    u2 = random.random()\n    # Apply Box-Muller transform\n    z1 = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)\n    z2 = math.sqrt(-2 * math.log(u1)) * math.sin(2 * math.pi * u2)\n    return z1, z2\ndef generate_normal_distribution(size, mu=0, sigma=1):\n    samples = []\n    for _ in range(size // 2):\n        z1, z2 = box_muller()\n        samples.extend([z1 * sigma + mu, z2 * sigma + mu])\n    if size % 2 != 0: # If odd size, generate one more\n        samples.append(box_muller()[0] * sigma + mu)\n    return samples
558	Machine Learning Engineer (ML)	Python	Fundamentals	Compute KL Divergence / Cross-Entropy Manually	medium	{Python,Coding,Fundamentals}	KL Divergence quantifies how much one probability distribution `P` diverges from a reference distribution `Q`, by summing `P(x) * log(P(x) / Q(x))`. Cross-Entropy measures the average number of bits needed to identify an event from a set of possibilities, given a predicted probability distribution `Q` for true distribution `P`, summing `-P(x) * log(Q(x))`.	import numpy as np\ndef kl_divergence(p, q):\n    # Ensure probabilities sum to 1 and avoid log(0)\n    p = np.array(p) / np.sum(p)\n    q = np.array(q) / np.sum(q)\n    # Add a small epsilon to q to avoid log(0) if q contains zeros\n    q = np.maximum(q, 1e-10)\n    return np.sum(p * np.log(p / q))\n\ndef cross_entropy(p, q):\n    p = np.array(p) / np.sum(p)\n    q = np.array(q) / np.sum(q)\n    q = np.maximum(q, 1e-10)\n    return -np.sum(p * np.log(q))
560	Machine Learning Engineer (ML)	Python	Coding	Write a Streaming Window Aggregator (Fixed / Sliding)	hard	{Python,Coding,"System Design"}	A streaming window aggregator processes data in defined time or count windows. For a fixed window, it collects events for a specific duration/count. For sliding windows, it moves a fixed-size window across the stream, continuously updating aggregates as new data arrives and old data expires.	from collections import deque\nimport time\nclass SlidingWindowAggregator:\n    def __init__(self, window_size_seconds):\n        self.window_size_seconds = window_size_seconds\n        self.data_points = deque() # Stores (timestamp, value)\n    def add_data_point(self, value):\n        current_time = time.time()\n        self.data_points.append((current_time, value))\n        # Remove old data points\n        while self.data_points and self.data_points[0][0] < current_time - self.window_size_seconds:\n            self.data_points.popleft()\n    def get_sum(self):\n        return sum(val for ts, val in self.data_points)
561	Machine Learning Engineer (ML)	Python	Coding	Parse a Large Log File and Extract Features	medium	{Python,Coding,"System Design"}	Parse a large log file line-by-line using Python's `open()` to avoid memory overload. Use regular expressions (re module) or string manipulation methods to efficiently extract specific features (e.g., timestamps, error codes, user IDs) based on predefined patterns.	import re\ndef parse_log_file(filepath, pattern):\n    extracted_features = []\n    with open(filepath, 'r') as f:\n        for line in f:\n            match = re.search(pattern, line)\n            if match:\n                # Example: If pattern captures groups, extract them\n                extracted_features.append(match.groups())\n    return extracted_features\n# Example usage: pattern to find 'ERROR' messages with a timestamp\n# parse_log_file('access.log', r'(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}).*ERROR')
562	Machine Learning Engineer (ML)	Python	Coding	Implement a MapReduce Word Count	medium	{Python,Coding,"System Design"}	Implement MapReduce word count by first defining a 'map' function that tokenizes text and emits `(word, 1)` pairs. Then, a 'reduce' function aggregates these pairs by grouping `(word, list_of_counts)` and summing the counts for each word.	def map_func(text):\n    for word in text.lower().split():\n        yield word, 1\ndef reduce_func(key, values):\n    yield key, sum(values)\ndef word_count_mapreduce(documents):\n    intermediate = {}\n    for doc in documents:\n        for word, count in map_func(doc):\n            intermediate.setdefault(word, []).append(count)\n    final_results = {}\n    for word, counts in intermediate.items():\n        for k, v in reduce_func(word, counts):\n            final_results[k] = v\n    return final_results
563	Machine Learning Engineer (ML)	Python	Coding	Deduplicate a Huge Dataset That Doesn’t Fit in Memory	hard	{Python,Coding,"System Design"}	To deduplicate a huge dataset, process it in chunks. Use hashing to create unique identifiers for records; write each unique record and its hash to a temporary file. Then, use external sorting on these hashes or load smaller, unique chunks into memory for final deduplication.	import hashlib\nimport os\ndef deduplicate_large_dataset(input_filepath, output_filepath, chunk_size=100000):\n    seen_hashes = set()\n    with open(input_filepath, 'r') as infile, open(output_filepath, 'w') as outfile:\n        for i, line in enumerate(infile):\n            line_hash = hashlib.sha256(line.encode('utf-8')).hexdigest()\n            if line_hash not in seen_hashes:\n                outfile.write(line)\n                seen_hashes.add(line_hash)\n            if (i + 1) % chunk_size == 0: # Optional: clear seen_hashes for very, very large files and use multiple passes / external sort\n                pass\n    # For truly massive datasets, one might need to write chunks to disk and then merge/dedup based on hashes.
564	Machine Learning Engineer (ML)	Python	Coding	Write a Data Pipeline That Retries Failed Tasks	medium	{Python,Coding,"System Design"}	Implement a retry mechanism using a loop with exponential backoff and a maximum number of attempts. Wrap the task execution in a `try-except` block to catch specific exceptions, then `sleep` before retrying to prevent overwhelming the system.	import time\ndef retry_task(task_func, max_retries=3, initial_delay_seconds=1):\n    for attempt in range(max_retries):\n        try:\n            result = task_func()\n            print(f'Task succeeded on attempt {attempt + 1}')\n            return result\n        except Exception as e:\n            print(f'Task failed on attempt {attempt + 1}: {e}')\n            if attempt < max_retries - 1:\n                delay = initial_delay_seconds * (2 ** attempt) # Exponential backoff\n                print(f'Retrying in {delay} seconds...')\n                time.sleep(delay)\n    print('Task failed after maximum retries.')\n    raise Exception('Max retries exceeded')
565	Machine Learning Engineer (ML)	Python	Coding	Implement Caching for Expensive Computations	medium	{Python,Coding,"System Design"}	Implement caching by storing the results of expensive function calls in a dictionary, keyed by function arguments. Before computing, check if inputs are in the cache; if so, return the stored result. Otherwise, compute the result and store it before returning.	def memoize(func):\n    cache = {}\n    def wrapper(*args, **kwargs):\n        key = (args, frozenset(kwargs.items())) # Create a hashable key\n        if key not in cache:\n            cache[key] = func(*args, **kwargs)\n        return cache[key]\n    return wrapper\n\n@memoize\ndef expensive_computation(n):\n    print(f'Computing {n}...')\n    time.sleep(1) # Simulate expensive work\n    return n * n
566	Machine Learning Engineer (ML)	Python	Coding	Implement a Basic Scheduler (Topological Sort)	hard	{Python,Coding,"System Design"}	A basic scheduler using topological sort processes tasks with dependencies by representing them as a Directed Acyclic Graph (DAG). Kahn's algorithm or DFS can then determine a valid execution order where all prerequisites for a task are completed first.	from collections import defaultdict, deque\ndef topological_sort(graph):\n    in_degree = defaultdict(int)\n    for node in graph:\n        for neighbor in graph[node]:\n            in_degree[neighbor] += 1\n    queue = deque([node for node in graph if in_degree[node] == 0])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n    if len(order) == len(graph): return order\n    else: raise ValueError('Graph contains a cycle')
580	Machine Learning Engineer (ML)	Python	System Design	Design a batch ETL workflow for model training.	medium	{"System Design",Python}	A batch ETL workflow for model training involves scheduled data extraction from various sources, distributed transformations (cleaning, feature engineering) using tools like Spark or Dask, and loading into a data warehouse or data lake. An orchestrator (e.g., Airflow, Prefect) manages dependencies, scheduling, and monitoring, ensuring data readiness for large-scale model training.	\N
567	Machine Learning Engineer (ML)	Python	System Design	Design a Feature Store Lookup Function	medium	{Python,"System Design",API}	Design a feature store lookup function that retrieves features for a given entity (e.g., user_id, item_id) with low latency. It should handle feature versioning, real-time vs. batch features, and potential caching layers for frequently accessed data.	class FeatureStore:\n    def __init__(self, storage_backend):\n        self.backend = storage_backend # e.g., Redis, DynamoDB, Parquet files\n        self.cache = {} # Simple in-memory cache\n    def get_features(self, entity_id: str, feature_names: list = None, version: str = 'latest') -> dict:\n        cache_key = (entity_id, tuple(sorted(feature_names)) if feature_names else None, version)\n        if cache_key in self.cache: return self.cache[cache_key]\n        # Simulate fetching from backend\n        print(f"Fetching features for {entity_id} from backend...")\n        raw_data = self.backend.get(entity_id, version)\n        if not raw_data: return {}\n        features = raw_data # Assume backend returns a dict\n        if feature_names: features = {k: features[k] for k in feature_names if k in features}\n        self.cache[cache_key] = features\n        return features\n    # backend could be a mock or actual connection
568	Machine Learning Engineer (ML)	Python	System Design	Design an end-to-end ML pipeline for training, validation, and deployment.	medium	{"System Design",Python}	An end-to-end ML pipeline involves robust data ingestion, scalable feature engineering, model training and rigorous validation. Key components include an MLOps orchestrator (e.g., Kubeflow, MLflow) for automation, a model registry for versioning, and deployment as a low-latency inference service with continuous monitoring for performance and data drift.	\N
569	Machine Learning Engineer (ML)	Python	System Design	Design a real-time recommendation system (e.g., YouTube, Netflix).	hard	{"System Design",Python,API}	A real-time recommendation system relies on capturing user interactions, generating candidate items (e.g., collaborative filtering, content-based via vector search), and ranking them using complex ML models (e.g., deep learning) for personalization. It requires a low-latency serving layer, real-time feature stores, and continuous feedback loops to adapt to user behavior.	\N
570	Machine Learning Engineer (ML)	Python	System Design	Design a system for ranking search results.	medium	{"System Design",Python,API}	Designing a search ranking system involves query parsing, efficient candidate retrieval (e.g., inverted index, vector search), and extensive feature engineering (query-document relevance, user context, freshness). A learning-to-rank model (e.g., LambdaMART, neural networks) then scores candidates, served via a low-latency API, with continuous A/B testing and offline evaluation.	\N
571	Machine Learning Engineer (ML)	Python	System Design	Design an online ads click-through rate (CTR) prediction system.	hard	{"System Design",Python,API}	An online ads CTR prediction system demands real-time feature extraction (user history, ad attributes, context) and specialized ML models (e.g., Wide & Deep, DCN) capable of handling sparse, high-dimensional data at scale. Low-latency inference is critical, often involving custom serving infrastructure and continuous model updates from live click feedback to maintain performance.	\N
572	Machine Learning Engineer (ML)	Python	System Design	Design a fraud detection system that works in real time.	hard	{"System Design",Python,API}	A real-time fraud detection system requires high-throughput streaming data ingestion and immediate feature extraction (e.g., transactional velocity, network graphs) from a real-time feature store. Machine learning models (e.g., XGBoost, graph neural networks) score risk, integrated with a rules engine, providing low-latency decisions via an API, emphasizing high precision/recall and continuous adaptation to new fraud patterns.	\N
573	Machine Learning Engineer (ML)	Python	System Design	Design a personalized feed (like TikTok/Instagram Reels).	hard	{"System Design",Python,API}	A personalized feed system involves capturing vast user interaction data, multi-stage retrieval (candidate generation from various sources), and multi-objective ranking (e.g., relevance, diversity, novelty) using deep learning models. Real-time feature updates, rapid experimentation via A/B testing, and a scalable low-latency serving infrastructure are paramount to deliver a dynamic and engaging experience.	\N
574	Machine Learning Engineer (ML)	Python	System Design	Design an A/B testing platform for ML models.	medium	{"System Design",Python}	An A/B testing platform for ML models needs robust experiment definition, randomized user assignment, controlled traffic splitting to different model versions, and comprehensive data collection of key metrics. It integrates with model deployment for seamless version rollout and provides a statistical analysis framework for evaluating model performance and business impact with confidence.	\N
575	Machine Learning Engineer (ML)	Python	System Design	Design a system for dynamic pricing (e.g., Uber surge pricing).	medium	{"System Design",Python,API}	A dynamic pricing system involves real-time forecasting of supply and demand, leveraging rich features like weather, events, and historical data. An optimization model (e.g., reinforcement learning, economic models) determines optimal prices, which are delivered via a low-latency API, with continuous monitoring and feedback loops to adapt to market dynamics.	\N
576	Machine Learning Engineer (ML)	Python	System Design	Design a face-recognition model deployment system.	medium	{"System Design",Python,API}	A face-recognition model deployment system requires robust, often GPU-optimized, model serving (e.g., containerized APIs) capable of handling varying image qualities and scales. Critical considerations include security, privacy (GDPR, CCPA compliance), efficient inference, and potentially edge deployment for applications demanding ultra-low latency or offline capabilities.	\N
577	Machine Learning Engineer (ML)	Python	System Design	Design a feature store for ML models.	medium	{"System Design",Python}	A feature store centralizes feature definitions, stores precomputed features for both online (low-latency access for inference) and offline (batch access for training) use, ensuring consistency. It standardizes feature engineering, improves discoverability, and provides versioning and lineage tracking, streamlining the ML development lifecycle.	\N
578	Machine Learning Engineer (ML)	Python	System Design	Design a streaming pipeline for data ingestion (Kafka/Flume/Kinesis).	medium	{"System Design",Python}	A streaming ingestion pipeline utilizes a distributed message broker (e.g., Kafka, Kinesis) to collect data from diverse producers. Stream processing engines (e.g., Spark Streaming, Flink) perform real-time transformations and enrichments, before persisting data to various sinks like a data lake, NoSQL databases, or real-time analytics platforms, ensuring fault tolerance and scalability.	\N
581	Machine Learning Engineer (ML)	Python	System Design	Design a distributed training pipeline for huge datasets.	hard	{"System Design",Python}	A distributed training pipeline for huge datasets leverages data parallelism (e.g., Horovod, PyTorch DDP) or model parallelism, using distributed file systems (e.g., HDFS, S3) for data access. It requires robust communication infrastructure and an orchestration framework like Kubeflow to manage compute resources (e.g., GPUs), synchronize model updates, and ensure fault tolerance during large-scale training runs.	\N
582	Machine Learning Engineer (ML)	Python	System Design	Design a scalable data validation system.	medium	{"System Design",Python}	A scalable data validation system integrates checks (e.g., schema, range, uniqueness, freshness) into both batch ETL and streaming pipelines using libraries like Great Expectations or Deequ. It defines data quality rules, automatically monitors validation metrics, and triggers alerts on detected anomalies, preventing corrupted or stale data from impacting model performance.	\N
583	Machine Learning Engineer (ML)	Python	System Design	Design a log processing pipeline for model monitoring.	medium	{"System Design",Python}	A log processing pipeline for model monitoring involves collecting structured logs from inference services, ingesting them via a streaming platform (e.g., Kafka), and processing in real-time (e.g., Spark, Flink) to extract and aggregate performance metrics. These metrics are stored in a time-series database (e.g., Prometheus) for dashboard visualization (e.g., Grafana) and automated alerting.	\N
584	Machine Learning Engineer (ML)	Python	System Design	Design a system to detect data drift & concept drift.	medium	{"System Design",Python}	A system to detect drift monitors input feature distributions (data drift) and model prediction/performance metrics (concept drift) over time. It employs statistical tests (e.g., KS-test, AD-test) or distance metrics to quantify changes, integrated with an alerting system. This proactively signals when model retraining or investigation is required to maintain performance.	\N
585	Machine Learning Engineer (ML)	Python	System Design	Design a pipeline that automatically triggers model retraining.	medium	{"System Design",Python}	An automated retraining pipeline is triggered by monitoring signals such as detected data/concept drift, significant model performance degradation, or new data volume thresholds. Upon triggering, an MLOps orchestrator (e.g., Airflow, Kubeflow) initiates a full training workflow including data fetching, preprocessing, model training, validation, and potential deployment of the new model.	\N
586	Machine Learning Engineer (ML)	Python	System Design	Design a unified data lake + warehouse architecture.	medium	{"System Design",Python}	A unified data lake + warehouse architecture combines a data lake (e.g., S3, HDFS) for storing raw, diverse data formats, with a data warehouse (e.g., Snowflake, BigQuery) for structured, curated data analytics. The 'lakehouse' pattern, using technologies like Delta Lake or Apache Iceberg, provides transactional capabilities and schema enforcement directly on the data lake, bridging the gap between both paradigms.	\N
587	Machine Learning Engineer (ML)	Python	System Design	Design an anomaly detection pipeline on streaming data.	hard	{"System Design",Python}	An anomaly detection pipeline on streaming data involves real-time feature extraction from high-throughput streams, applying streaming-friendly anomaly detection algorithms (e.g., Isolation Forest, statistical process control, deep learning on sequences). It requires dynamic thresholding, a robust alerting mechanism, and often a feedback loop to reduce false positives/negatives, adapting to evolving data patterns.	\N
588	Machine Learning Engineer (ML)	Python	System Design	Design an ML inference service that handles millions of requests per day.	hard	{"System Design",Python,API}	An ML inference service for millions of requests daily requires containerization (Docker) and orchestration (Kubernetes) for auto-scaling and high availability. It leverages efficient model serving frameworks (e.g., TorchServe, TensorFlow Serving) for low-latency predictions, uses load balancing, and often incorporates caching for frequently accessed results, all while robustly monitoring performance and resource usage.	\N
589	Machine Learning Engineer (ML)	Python	System Design	Design a low-latency model serving architecture.	hard	{"System Design",Python,API}	A low-latency model serving architecture focuses on minimizing response times through optimized model formats (e.g., ONNX), efficient runtimes (e.g., Triton Inference Server), dedicated hardware (GPUs/TPUs), and in-memory feature stores. It employs techniques like batching, minimal network hops, and potentially edge deployment to achieve stringent latency SLOs, ensuring critical real-time decisions.	\N
590	Machine Learning Engineer (ML)	Python	System Design	Design a system to serve multiple versions of a model.	medium	{"System Design",Python,API}	Serving multiple model versions utilizes a model registry for version control and metadata. Deployment involves routing logic (e.g., API gateway, load balancer) to direct requests to specific, containerized model versions, enabling A/B testing, gradual rollouts (e.g., canary, blue-green deployments), and quick rollbacks to stable versions without downtime.	\N
591	Machine Learning Engineer (ML)	Python	System Design	Design scalable GPU inference for large models.	hard	{"System Design",Python,API}	Scalable GPU inference for large models relies on GPU-optimized serving frameworks (e.g., NVIDIA Triton Inference Server) and orchestration (Kubernetes with GPU scheduling). It employs efficient batching, model parallelism/sharding for very large models, and dynamic batching, ensuring cost-effective utilization of GPU resources while maintaining high throughput and low latency inference.	\N
592	Machine Learning Engineer (ML)	Python	System Design	Design a real-time fraud detection inference API.	hard	{"System Design",Python,API}	A real-time fraud detection inference API demands ultra-low latency and high availability. It integrates with real-time feature stores for immediate feature retrieval, utilizes a highly optimized inference engine, and exposes a synchronous API for instant decision-making. Robust error handling, detailed logging for auditing, and dedicated low-latency infrastructure are critical for mission-critical operations.	\N
593	Machine Learning Engineer (ML)	Python	System Design	Design a distributed vector search system (FAISS/ScaNN).	hard	{"System Design",Python}	A distributed vector search system indexes high-dimensional vectors (e.g., using FAISS/ScaNN for approximate nearest neighbor search) and distributes the index across multiple nodes. It includes a query routing layer, parallel search execution on shards, and aggregation of results, ensuring scalability and low-latency retrieval for large-scale applications like recommendation or semantic search.	\N
595	Machine Learning Engineer (ML)	Python	System Design	Design a caching layer for ML predictions.	medium	{"System Design",Python,API}	A caching layer for ML predictions (e.g., using Redis or Memcached) stores predictions for frequently requested inputs, reducing redundant computation and improving inference latency. Key considerations include effective cache invalidation strategies (e.g., TTL, LRU eviction), ensuring data consistency, and monitoring cache hit rates to maximize its efficiency and impact.	\N
596	Machine Learning Engineer (ML)	Python	System Design	Design a model registry (versioning, lineage, rollback).	medium	{"System Design",Python}	A model registry serves as a central repository for tracking model artifacts, metadata (hyperparameters, training data), and lineage, linking models back to their creation. It enables robust versioning, facilitates model discovery, simplifies deployment workflows, and provides essential rollback capabilities to previous stable versions, ensuring MLOps best practices.	\N
597	Machine Learning Engineer (ML)	Python	System Design	Design a gradual model rollout system (shadow, canary, blue-green).	medium	{"System Design",Python}	A gradual model rollout system mitigates deployment risks by employing strategies like shadow deployment (new model runs in parallel but old serves traffic), canary release (small percentage of traffic to new model), or blue-green deployment (separate environments for old/new). These methods enable real-time performance monitoring, A/B testing, and safe rollbacks, ensuring smooth transitions and minimal user impact.	\N
598	Machine Learning Engineer (ML)	Python	System Design	Design a monitoring system for model performance metrics.	medium	{"System Design",Python}	A model performance monitoring system collects prediction logs, actual outcomes, and relevant feature inputs. It computes key metrics (e.g., accuracy, precision, recall, RMSE, F1) in near real-time, stores them in a time-series database (e.g., Prometheus), and visualizes them through dashboards (e.g., Grafana) with automated alerts for any detected performance degradation or anomalies.	\N
599	Machine Learning Engineer (ML)	Python	System Design	Design a system to detect realtime model failures or spikes.	medium	{"System Design",Python}	A real-time model failure detection system monitors operational metrics of inference services, such as QPS, latency, error rates, and resource utilization (CPU/GPU). It employs anomaly detection techniques or threshold-based alerts on these metrics, integrated with a robust alerting system (e.g., PagerDuty, Slack) for immediate notification of critical issues or unexpected spikes.	\N
600	Machine Learning Engineer (ML)	Python	System Design	Design a load-balancing strategy for ML inference servers.	medium	{"System Design",Python}	A load-balancing strategy for ML inference servers uses intelligent load balancers (e.g., Kubernetes Ingress, cloud-native solutions) to distribute incoming requests efficiently. It can leverage metrics like server utilization, response latency, or available GPU memory to route traffic, ensuring optimal resource utilization, high availability, and consistent low-latency performance for inference services.	\N
601	Machine Learning Engineer (ML)	Python	System Design	Design a system for monitoring feature freshness.	medium	{"System Design",Python}	A feature freshness monitoring system tracks the age and update frequency of features stored in a feature store or flowing through data pipelines. It implements automated checks and alerts for stale features or unexpected delays in data updates, which is crucial for real-time ML models that heavily depend on current and accurate input data to maintain prediction quality.	\N
602	Machine Learning Engineer (ML)	Python	System Design	Design SLA/SLO for ML model APIs.	medium	{"System Design",Python,API}	Defining SLAs (Service Level Agreements) and SLOs (Service Level Objectives) for ML model APIs involves setting explicit targets for availability (e.g., 99.9% uptime), latency (e.g., 95th percentile under 100ms), and error rates. These are then tracked by comprehensive monitoring systems with alerting mechanisms to ensure compliance and proactively address any deviations, aligning with business expectations.	\N
603	Machine Learning Engineer (ML)	Python	System Design	Design a scalable logging + tracing system for ML services.	medium	{"System Design",Python}	A scalable logging and tracing system for ML services employs structured logging for all components, aggregated by a centralized logging solution (e.g., ELK stack, Splunk) for efficient storage and analysis. Distributed tracing tools (e.g., OpenTelemetry, Jaeger) are integrated to track request flow across microservices, enabling comprehensive debugging, performance analysis, and root cause identification in complex ML systems.	\N
604	Machine Learning Engineer (ML)	Python	System Design	Design an LLM-powered chatbot system (like ChatGPT).	hard	{"System Design",Python}	An LLM-powered chatbot system integrates a large language model (LLM) with conversational memory for context retention and prompt engineering strategies to guide responses. It incorporates input/output filtering for safety and potentially external tools/APIs for function calling, all orchestrated to deliver coherent, relevant, and engaging conversational experiences while managing latency and cost.	\N
605	Machine Learning Engineer (ML)	Python	System Design	Design a RAG (Retrieval-Augmented Generation) system.	hard	{"System Design",Python}	A RAG system indexes a proprietary knowledge base using embeddings and a vector database. A retrieval component (e.g., vector search) fetches relevant context based on the user's query, which is then passed to an LLM. The LLM grounds its generation on this retrieved information, significantly reducing hallucinations and providing more accurate, up-to-date, and attributable responses.	\N
606	Machine Learning Engineer (ML)	Python	System Design	Design an LLM monitoring & feedback loop system.	hard	{"System Design",Python}	An LLM monitoring and feedback loop system tracks input/output quality (e.g., toxicity, relevance, coherence), model performance (e.g., latency, cost, adherence to instructions), and collects explicit user feedback. It integrates human-in-the-loop review for quality assurance, using these insights to drive prompt optimization, fine-tuning, or retraining, ensuring continuous improvement and reliability.	\N
607	Machine Learning Engineer (ML)	Python	System Design	Design a multi-agent LLM system with orchestration.	hard	{"System Design",Python}	A multi-agent LLM system defines specialized LLM-powered agents (e.g., planner, tool-user, summarizer), each with distinct roles and capabilities. A central orchestrator manages agent interactions, delegating tasks, facilitating communication, and coordinating their actions. This modular approach enables complex problem-solving by breaking down tasks, improving overall efficiency and robustness.	\N
608	Machine Learning Engineer (ML)	Python	System Design	How would you design a real-time feature pipeline for a recommendation system?	hard	{"System Design",Python}	I'd leverage a stream processing platform (e.g., Kafka, Flink) for ingesting raw events and transforming them into real-time features using windowing and stateful processing. These features would then be pushed to a low-latency online feature store (e.g., Redis, DynamoDB) for immediate consumption by the recommendation model, ensuring freshness and online/offline consistency.	
609	Machine Learning Engineer (ML)	Python	System Design	Design a system to compute daily aggregates for billions of events.	medium	{"System Design",Python}	I would design a batch processing system utilizing a distributed framework like Spark or Flink, operating on data stored in a data lake (e.g., S3). Events would first be ingested via a message queue (e.g., Kafka). Daily scheduled jobs would read these events, perform aggregations using efficient windowing functions, and store the results in a performant analytical store (e.g., Parquet in S3, Snowflake).	
610	Machine Learning Engineer (ML)	Python	System Design	How would you build a feature store from scratch?	hard	{"System Design",Python}	A feature store requires both an offline component (e.g., a data lake with Spark/Flink for batch processing and backfilling) and an online component (e.g., Redis, Cassandra for low-latency serving). Key challenges include ensuring online/offline consistency, feature versioning, discoverability via a metadata service, and robust data integrity checks.	
611	Machine Learning Engineer (ML)	Python	System Design	How do you design a schema to store ML features efficiently?	medium	{"System Design",Python}	I'd design a dual schema: column-oriented (e.g., Parquet) for offline analytical processing and row-oriented (e.g., Protobuf-serialized in Redis) for online, low-latency lookups. Standardized data types and efficient encoding for sparse features (e.g., sparse vectors) would be crucial, ensuring schema evolution and backward compatibility are considered.	
612	Machine Learning Engineer (ML)	Python	System Design	How do you handle late-arriving data in a feature pipeline?	medium	{"System Design",Python}	For stream processing, I'd implement watermarks and define an 'allowed lateness' window to gracefully process late data within a reasonable time frame (e.g., in Apache Flink). For data arriving significantly late or requiring historical recalculation, a dedicated reprocessing mechanism using batch jobs or specific data versioning strategies would be necessary.	
613	Machine Learning Engineer (ML)	Python	System Design	How would you design a data quality validation system for ML pipelines?	medium	{"System Design",Python}	I would integrate data profiling and validation tools (e.g., Great Expectations, Deequ) at critical stages: data ingestion, transformation, and feature generation. Define expected schema, statistical ranges, and distribution rules. Anomalies detected would trigger alerts, potentially halting the pipeline and preventing low-quality data from reaching models.	
614	Machine Learning Engineer (ML)	Python	System Design	Design a scalable data ingestion pipeline for clickstream data.	medium	{"System Design",Python}	I'd use a robust message queue (e.g., Kafka or Kinesis) for high-throughput, fault-tolerant ingestion from client-side trackers. Stream processors (e.g., Flink, Spark Streaming) would then perform light real-time transformations and route the data to a data lake (e.g., S3) for long-term storage and batch processing, and to an online store for real-time features.	
615	Machine Learning Engineer (ML)	Python	System Design	Explain how you'd build an offline + online feature sync mechanism.	hard	{"System Design",Python}	Features would be generated and validated in an offline batch process, stored in a data lake. A synchronization service, often part of a feature store (e.g., Feast), would then select and push relevant features to a low-latency online store (e.g., Redis). Consistency is paramount, achieved by using identical feature definitions and potentially atomic updates or versioning for feature sets.	
616	Machine Learning Engineer (ML)	Python	System Design	How would you design a distributed training system for large models?	hard	{"System Design",Python}	I'd utilize data parallelism (e.g., Horovod, PyTorch DDP) for large datasets or model parallelism (e.g., Megatron-LM, FSDP) for models exceeding single GPU memory. A distributed computing framework (e.g., Kubernetes, Ray) would manage resource scheduling, inter-node communication, and fault tolerance across a cluster of GPUs.	
617	Machine Learning Engineer (ML)	Python	System Design	How do you manage hyperparameter tuning at scale?	medium	{"System Design",Python}	I'd employ frameworks like Optuna or Ray Tune to orchestrate parallel hyperparameter search trials using advanced algorithms (e.g., Bayesian optimization, HyperBand). This system would integrate with an experiment tracking platform (e.g., MLflow, Weights & Biases) to log results, artifacts, and manage distributed compute resources efficiently.	
618	Machine Learning Engineer (ML)	Python	System Design	How would you design a training pipeline that supports auto-retraining?	medium	{"System Design",Python}	The pipeline would be triggered by predefined events, such as a schedule, new data volume thresholds, or detected model/data drift in production. An orchestration tool (e.g., Kubeflow Pipelines, Airflow) would automate data preparation, training, validation, and candidate model registration, ensuring continuous model freshness and performance.	
619	Machine Learning Engineer (ML)	Python	System Design	How do you design a multi-tenant GPU training platform?	hard	{"System Design",Python}	I'd leverage Kubernetes with GPU-aware schedulers (e.g., Volcano) to provide robust resource isolation (namespaces, quotas, network policies) and fair sharing of GPUs. Strong authentication/authorization, secure containerization, and granular monitoring (e.g., NVIDIA DCGM) would ensure security and efficient resource allocation for each tenant.	
620	Machine Learning Engineer (ML)	Python	System Design	Design a system that supports versioning of models, data, and experiments.	hard	{"System Design",Python}	I'd combine DVC for data versioning (linking large datasets in S3/HDFS to Git), Git for code and pipeline versioning, and an MLOps platform like MLflow or Weights & Biases for experiment tracking (hyperparameters, metrics, artifacts). A central model registry would manage model lifecycle and versions, ensuring reproducibility and auditability.	
621	Machine Learning Engineer (ML)	Python	System Design	How do you scale training for dataset sizes that exceed memory (sharding / streaming)?	medium	{"System Design",Python}	I would employ data sharding across distributed workers, where each worker loads and processes a distinct subset of the data (e.g., from TFRecord or Parquet files in object storage). Alternatively, leverage data streaming techniques (e.g., TensorFlow Data API, PyTorch DataLoader with `IterableDataset`) to load data in mini-batches directly from storage, avoiding full in-memory loads.	
622	Machine Learning Engineer (ML)	Python	System Design	How do you design an automated evaluation framework for ML models?	medium	{"System Design",Python}	The framework would define a comprehensive set of evaluation metrics (e.g., accuracy, precision, recall, latency) specific to the model's objective. It would automate the calculation of these metrics on holdout datasets post-training, compare against baselines and production models, and trigger alerts if performance regressions or significant deviations are detected, integrating with an experiment tracker.	
623	Machine Learning Engineer (ML)	Python	System Design	How would you build a model registry and management system?	medium	{"System Design",Python}	A model registry centralizes storing model artifacts, metadata (metrics, lineage, dependencies), and managing their lifecycle (staging, production, archived). It provides versioning, discoverability through a catalog, and API endpoints for frictionless model deployment. Tools like MLflow Model Registry or Kubeflow Pipelines' Model Management component are excellent starting points.	
624	Machine Learning Engineer (ML)	Python	System Design	How would you design a low-latency real-time inference service?	hard	{"System Design",Python}	I'd optimize models (e.g., quantization, ONNX Runtime) and use a high-performance serving framework (e.g., Triton Inference Server, FastAPI with Uvicorn) on a container orchestration platform (e.g., Kubernetes) with GPU/CPU auto-scaling. Implementing a robust caching layer (e.g., Redis) for frequently requested predictions and utilizing efficient network protocols are crucial.	
625	Machine Learning Engineer (ML)	Python	System Design	Design a system to serve multiple model versions simultaneously.	medium	{"System Design",Python}	Each model version would be deployed as a separate, independently scalable service endpoint. An API Gateway (e.g., Envoy, AWS API Gateway) or service mesh (e.g., Istio) would manage intelligent traffic routing based on user segments, headers, or defined percentages, enabling A/B testing, canary deployments, and graceful rollouts.	
626	Machine Learning Engineer (ML)	Python	System Design	How would you implement A/B testing at the inference layer?	medium	{"System Design",Python}	I'd configure the inference service's load balancer or API Gateway to split incoming traffic based on predefined rules (e.g., user ID hash, percentage split) to different model versions. Each variant's predictions and associated business metrics would be logged and analyzed in an experimentation platform to determine statistical significance of performance differences.	
627	Machine Learning Engineer (ML)	Python	System Design	Design an inference service that automatically scales with traffic.	medium	{"System Design",Python}	Deploy the service on a container orchestration platform like Kubernetes, configured with a Horizontal Pod Autoscaler (HPA). The HPA would scale the number of service replicas based on metrics like CPU utilization, custom metrics (e.g., QPS, GPU utilization), or message queue length, ensuring responsiveness under varying load.	
628	Machine Learning Engineer (ML)	Python	System Design	How do you deploy models on edge devices with limited compute?	hard	{"System Design",Python}	Models must be heavily optimized through techniques like quantization, pruning, and distillation, then converted to lightweight formats (e.g., TensorFlow Lite, ONNX). Specialized runtimes and embedded containerization (e.g., Docker Slim) would ensure efficient execution, with robust remote update and limited telemetry monitoring mechanisms.	
629	Machine Learning Engineer (ML)	Python	System Design	How would you design a caching layer for ML inference?	medium	{"System Design",Python}	I'd implement a low-latency key-value store (e.g., Redis, Memcached) to cache prediction results. The cache key would be derived from the input features or request parameters. Careful consideration of cache invalidation policies (e.g., TTL, explicit invalidation) and consistency with frequently updated models is crucial to ensure data freshness.	
630	Machine Learning Engineer (ML)	Python	System Design	Explain how you'd design a batch inference pipeline for large datasets.	medium	{"System Design",Python}	I'd leverage a distributed batch processing framework (e.g., Spark, Dask) to efficiently read large datasets from a data lake (e.g., S3, HDFS). The pipeline would load the trained model, apply inference in parallel across worker nodes, and write the generated predictions back to scalable storage (e.g., Parquet files in S3, a data warehouse) on a scheduled basis.	
631	Machine Learning Engineer (ML)	Python	System Design	How do you handle cold starts in a model-serving environment?	medium	{"System Design",Python}	To mitigate cold starts, I'd implement pre-warming by maintaining a minimum number of active instances. For scale-out events, models can be proactively loaded into new instances, or traffic shaping/throttling can be applied during startup. Pre-baking container images with model artifacts and dependencies also reduces deployment latency.	
632	Machine Learning Engineer (ML)	Python	System Design	How would you detect model drift in production?	medium	{"System Design",Python}	I'd continuously monitor input feature distributions (data drift) and model prediction distributions/actual outcomes (concept drift) in production. By comparing these against baseline distributions using statistical tests (e.g., KS test, Jensen-Shannon divergence), significant shifts can be detected, triggering alerts for potential model retraining.	
633	Machine Learning Engineer (ML)	Python	System Design	How do you design a monitoring system for feature drift?	medium	{"System Design",Python}	The system would continuously capture descriptive statistics (e.g., mean, std dev, quantiles) and distributions of features at various pipeline stages. These are compared against historical baselines or training data distributions using drift metrics (e.g., Population Stability Index). Visualizations in a dashboard with configurable alerting thresholds (e.g., Prometheus/Grafana) are essential.	
634	Machine Learning Engineer (ML)	Python	System Design	How would you build a dashboard to track ML system health?	medium	{"System Design",Python}	I'd aggregate key operational metrics (e.g., inference latency, error rates, resource utilization from Kubernetes/Prometheus) and ML-specific metrics (e.g., model performance, data/concept drift, feature freshness). A centralized dashboarding tool like Grafana or Datadog would visualize these metrics, providing real-time insights into the health and performance of the entire ML ecosystem.	
635	Machine Learning Engineer (ML)	Python	System Design	How do you capture and log mispredictions for retraining?	medium	{"System Design",Python}	Log all model predictions along with their associated input features and, crucially, ground truth labels or user feedback when available. When a misprediction or a discrepancy is identified (e.g., via human review or explicit feedback), these specific data points are stored in a dedicated 'feedback queue' for re-labeling and subsequent targeted retraining, enhancing model robustness.	
636	Machine Learning Engineer (ML)	Python	System Design	How do you design alerting for ML performance degradation?	medium	{"System Design",Python}	I'd define specific performance metrics (e.g., accuracy, AUC, F1-score) and establish acceptable degradation thresholds. Statistical methods (e.g., control charts, A/B testing statistical significance) would detect meaningful drops in performance. Alerts, categorized by severity, would be integrated with notification systems (e.g., PagerDuty, Slack) to prompt immediate investigation and action.	
637	Machine Learning Engineer (ML)	Python	System Design	How do you design a feedback loop to improve models continuously?	hard	{"System Design",Python}	The loop involves collecting user feedback or actual outcomes post-prediction in production. This feedback data is then human-labeled or automatically processed, added to an existing training dataset, and used to periodically retrain and validate models. This continuous learning cycle ensures models adapt to evolving data and user behavior, improving performance over time.	
638	Machine Learning Engineer (ML)	Python	System Design	Design a retrieval-augmented generation (RAG) system.	hard	{"System Design",Python}	A RAG system consists of an indexing pipeline that generates embeddings of domain-specific documents and stores them in a scalable vector database. At inference, user queries are embedded, relevant documents retrieved from the vector store, and then passed as context to a large language model (LLM) to generate an informed and grounded response.	
639	Machine Learning Engineer (ML)	Python	System Design	How would you serve a large language model with low latency?	hard	{"System Design",Python}	I'd optimize the LLM (e.g., quantization, speculative decoding, KV caching) and use specialized serving frameworks (e.g., Triton Inference Server, vLLM, Hugging Face TGI) on powerful GPUs. Techniques like dynamic batching for throughput, multi-GPU setups for model parallelism, and efficient network configurations are crucial for achieving low latency.	
640	Machine Learning Engineer (ML)	Python	System Design	How do you design an embedding service for semantic search?	medium	{"System Design",Python}	I'd host a robust pre-trained embedding model (e.g., Sentence-BERT, OpenAI Embeddings) as a scalable, low-latency API service (e.g., FastAPI on Kubernetes). This service would vectorize input text into high-dimensional embeddings, which are then indexed and stored in a vector database for efficient semantic similarity search and retrieval.	
641	Machine Learning Engineer (ML)	Python	System Design	How would you design a vector database for millions of embeddings?	hard	{"System Design",Python}	I would select a distributed vector database (e.g., Milvus, Pinecone, Qdrant) that supports efficient Approximate Nearest Neighbor (ANN) indexing algorithms (e.g., HNSW, IVFFlat). This database must offer horizontal scalability, fault tolerance, and optimized storage for high-dimensional vectors, ensuring fast similarity search capabilities for millions of embeddings.	
642	Machine Learning Engineer (ML)	Python	System Design	How do you design a multi-agent system for task automation?	hard	{"System Design",Python}	I'd design individual agents with distinct roles (e.g., LLM-based planner, tool-using agents, critics) and specific capabilities. An orchestration layer (e.g., LangChain agents, custom framework) would manage inter-agent communication, task delegation, shared memory, and robust error handling to coordinate complex workflows and achieve automation.	
643	Machine Learning Engineer (ML)	Python	System Design	How would you build a scalable prompt-management system?	medium	{"System Design",Python}	I would centralize prompt storage with versioning and templating (e.g., Jinja2), exposing them via an API for dynamic retrieval. The system would support A/B testing of different prompt versions, track their performance metrics, and implement role-based access control to manage prompt evolution and usage across various teams and applications.	
644	Machine Learning Engineer (ML)	Python	System Design	Design a pipeline to fine-tune LLMs on proprietary data.	hard	{"System Design",Python}	The pipeline would start with meticulous data cleaning, formatting, and preparation specific to the fine-tuning task. It would then utilize distributed training frameworks (e.g., PyTorch FSDP, DeepSpeed) on specialized hardware (GPUs) for efficient training, ensuring data privacy, robust evaluation against a golden dataset, and secure model artifact storage.	
645	Machine Learning Engineer (ML)	Python	System Design	How do you design an API gateway for LLM inference services?	medium	{"System Design",Python}	An API Gateway (e.g., Nginx, Envoy, AWS API Gateway) would provide a unified entry point, handling crucial functionalities like authentication, authorization, rate limiting, and request/response transformation. It intelligently routes requests to various LLM backend services, ensuring security, manageability, and observability of all LLM interactions.	
646	Machine Learning Engineer (ML)	Python	System Design	How would you design a recommendation system end-to-end?	hard	{"System Design",Python}	An end-to-end system involves robust data ingestion (user interactions, item metadata), real-time and batch feature engineering, and model training (e.g., collaborative filtering, deep learning). It would include a low-latency serving layer for personalized recommendations, a comprehensive A/B testing framework, and a continuous feedback loop for iterative model improvement.	
647	Machine Learning Engineer (ML)	Python	System Design	How would you design a fraud detection system with real-time inference?	hard	{"System Design",Python}	I'd design a system ingesting streaming transaction data (e.g., Kafka/Kinesis), generating real-time features using stream processing, and serving an anomaly detection/classification model via a low-latency API. It would integrate a rule engine for heuristic checks and a feedback mechanism for human review of suspicious activities, driving continuous model retraining.	
648	Machine Learning Engineer (ML)	Python	System Design	How do you design a ranking system for search?	hard	{"System Design",Python}	The system would combine a retrieval stage (e.g., BM25, vector search) to fetch relevant candidates with a learning-to-rank model (e.g., LambdaMART, neural networks) for scoring. Features would encompass query-document relevance, user signals, and item properties. This is served via a low-latency inference service, with A/B testing crucial for iterative improvement.	
649	Machine Learning Engineer (ML)	Python	System Design	How would you build a demand-forecasting platform?	medium	{"System Design",Python}	I'd build a platform that ingests historical time-series data, applying robust feature engineering (e.g., seasonality, trend, external factors). It would support a variety of statistical (ARIMA) and ML models (e.g., LightGBM, Prophet, DeepAR) with automated training and MLOps for deployment, offering explainability and scenario planning features for business users.	
650	Machine Learning Engineer (ML)	Python	System Design	Design an anomaly detection system for streaming time-series data.	hard	{"System Design",Python}	I'd ingest time-series data via a stream processor (e.g., Flink) performing real-time feature extraction (e.g., moving averages, statistical windows). Anomaly detection models (e.g., Isolation Forest, autoencoders, statistical process control) would operate on this streaming data, triggering alerts upon anomaly detection, often with human review for validation.	
651	Machine Learning Engineer (ML)	Python	System Design	How do you design an experimentation platform for ML models?	hard	{"System Design",Python}	The platform would enable controlled A/B tests with flexible traffic splitting at the inference layer. It would capture variant-specific metrics (e.g., CTR, conversion rates), provide robust statistical analysis tools to determine significance, and include experiment versioning, logging, and automated rollback capabilities to manage and validate model changes safely.	
652	Machine Learning Engineer (ML)	Python	System Design	How would you build a safe-guard system to prevent bad model rollout?	medium	{"System Design",Python}	I'd implement multi-stage deployment strategies like canary deployments (small percentage of traffic) or shadow testing (mirroring production traffic without impact). Automated checks for performance degradation, error rates, and data/concept drift, coupled with a robust automated rollback mechanism, would prevent any problematic models from reaching all users.	
653	Machine Learning Engineer (ML)	Python	System Design	How do you design a pipeline to support multi-modal ML models?	hard	{"System Design",Python}	The pipeline would handle diverse data ingestion (images, text, audio) from various sources, followed by synchronized feature extraction for each modality. Data fusion techniques (e.g., early, late, hybrid fusion) would then combine these features before feeding them into a multi-modal model architecture (e.g., transformers with modality-specific encoders), ensuring data alignment.	
654	Machine Learning Engineer (ML)	Python	System Design	Design a model explainability system for regulated industries.	hard	{"System Design",Python}	I'd integrate state-of-the-art Explainable AI (XAI) methods (e.g., SHAP, LIME) directly into the model inference pipeline. The system would generate and store explanations for individual predictions, accessible via APIs, ensuring comprehensive audit trails and compliance with regulatory requirements by transparently documenting model decisions and their rationale.	
655	Machine Learning Engineer (ML)	Python	System Design	How do you design an architecture that supports both batch and real-time ML?	hard	{"System Design",Python}	I'd adopt a lambda or kappa architecture, using a unified feature store to ensure consistency between offline (batch training) and online (real-time inference) features. A stream processing layer handles low-latency real-time needs, complemented by a batch processing layer for historical data processing, large-scale computations, and model retraining.	
656	Machine Learning Engineer (ML)	Python	System Design	How would you design a scalable metadata store for ML pipelines?	medium	{"System Design",Python}	A scalable metadata store would track comprehensive information about ML artifacts (datasets, models), lineage (inputs, outputs, transformations), and execution details of pipelines. I'd use a NoSQL database (e.g., Cassandra, PostgreSQL with JSONB) or a specialized MLOps tool (e.g., MLflow, Kubeflow Metadata Store) for its scalability, efficient querying, and discoverability capabilities.	
657	Machine Learning Engineer (ML)	Python	System Design	How do you design an inference graph that chains multiple ML models?	hard	{"System Design",Python}	I'd design a Directed Acyclic Graph (DAG) where nodes represent individual ML models or preprocessing steps. A specialized serving framework (e.g., Triton Inference Server's model ensembles, TensorFlow Serving with custom ops) would orchestrate the execution flow, passing intermediate outputs as inputs between chained models, optimizing for low latency and robust error handling.	
658	AI Engineer	Python	Fundamentals	What is the difference between AI, Machine Learning, and Deep Learning?	easy	{Python,Fundamentals}	AI is the broad field of creating intelligent machines. Machine Learning (ML) is a subset of AI where systems learn from data without explicit programming. Deep Learning is a specialized subset of ML that uses multi-layered neural networks to learn complex patterns and representations from vast amounts of data.	\N
659	AI Engineer	Python	Fundamentals	What are the main types of Machine Learning?	easy	{Python,Fundamentals}	The main types are Supervised Learning (learning from labeled data, e.g., classification, regression), Unsupervised Learning (finding patterns in unlabeled data, e.g., clustering, dimensionality reduction), and Reinforcement Learning (learning through trial and error with rewards and penalties).	\N
660	AI Engineer	Python	Fundamentals	Explain the bias-variance tradeoff.	medium	{Python,Fundamentals}	The bias-variance tradeoff is a central problem in supervised learning. Bias refers to error from overly simplistic models (underfitting), while variance refers to error from overly complex models sensitive to noise in training data (overfitting). The goal is to find a balance between bias and variance to achieve optimal generalization performance on unseen data.	\N
661	AI Engineer	Python	Fundamentals	What is overfitting? How do you detect and prevent it?	medium	{Python,Fundamentals}	Overfitting occurs when a model learns the training data too well, capturing noise and specific details, leading to poor performance on new, unseen data. It's detected when training loss is low but validation/test loss is high. Prevention methods include increasing training data, cross-validation, regularization (L1/L2), early stopping, and using simpler models or dropout in neural networks.	\N
662	AI Engineer	Python	Fundamentals	What is regularization? Compare L1 and L2.	medium	{Python,Fundamentals}	Regularization is a technique to prevent overfitting by adding a penalty term to the loss function, encouraging simpler models. L1 regularization (Lasso) adds the absolute value of coefficients, promoting sparsity and feature selection by driving some coefficients to zero. L2 regularization (Ridge) adds the squared magnitude of coefficients, shrinking them towards zero but rarely making them exactly zero, thus reducing their impact and preventing large weights.	\N
663	AI Engineer	Python	Fundamentals	Explain cross-validation and why it is used.	medium	{Python,Fundamentals}	Cross-validation is a resampling procedure used to evaluate ML models on a limited data sample. It involves partitioning data into multiple folds, training on a subset, and testing on the remaining fold, repeating this process. This helps estimate how the model will generalize to an independent dataset and detect overfitting by providing a more robust measure of model performance.	\N
664	AI Engineer	Python	Fundamentals	What is a loss function? Give common examples.	easy	{Python,Fundamentals}	A loss function quantifies the discrepancy between a model's predicted output and the actual target value, guiding the model's learning process by indicating how 'wrong' its predictions are. Common examples include Mean Squared Error (MSE) for regression, Cross-Entropy Loss for classification, and Huber Loss for robust regression.	\N
665	AI Engineer	Python	Fundamentals	What is gradient descent? How does it work?	medium	{Python,Fundamentals}	Gradient Descent is an iterative optimization algorithm used to find the minimum of a function, typically a loss function. It works by calculating the gradient (slope) of the loss function with respect to the model's parameters, and then adjusting the parameters in the direction opposite to the gradient by a step size (learning rate) to progressively minimize the loss.	\N
666	AI Engineer	Python	Fundamentals	What is the difference between batch, mini-batch, and stochastic gradient descent?	medium	{Python,Fundamentals}	Batch Gradient Descent computes gradients using the entire training dataset for each update, which is slow but stable. Stochastic Gradient Descent (SGD) computes gradients and updates parameters for each individual training example, making it fast but noisy. Mini-batch Gradient Descent strikes a balance by using small random subsets of the training data (mini-batches) for updates, offering a good compromise between speed and stability, and is most commonly used in deep learning.	\N
667	AI Engineer	Python	Fundamentals	What is a feature? How do you select good features?	medium	{Python,Fundamentals}	A feature is an individual measurable property or characteristic of a phenomenon being observed, used as input to a model. Good features are relevant, non-redundant, and robust. Selecting them involves domain knowledge, correlation analysis, statistical tests (e.g., ANOVA, chi-squared), and techniques like Recursive Feature Elimination (RFE) or using tree-based models for feature importance scores, aiming to improve model performance and interpretability.	\N
668	AI Engineer	Python	Fundamentals	Explain how a neural network learns.	medium	{Python,Fundamentals}	A neural network learns by iteratively adjusting its internal weights and biases. During a forward pass, it makes predictions. The difference between these predictions and the actual labels is quantified by a loss function. This loss is then backpropagated through the network to calculate gradients, which guide an optimization algorithm (like gradient descent) to update weights and minimize the loss, thus improving accuracy over time.	\N
669	AI Engineer	Python	Fundamentals	What causes vanishing and exploding gradients?	hard	{Python,Fundamentals}	Vanishing gradients occur when gradients become extremely small during backpropagation, causing earlier layers to learn very slowly or stop learning altogether, often due to activation functions like sigmoid or tanh. Exploding gradients happen when gradients become extremely large, leading to unstable training and large weight updates, often due to large weights or deep networks. Both hinder effective training of deep neural networks.	\N
670	AI Engineer	Python	Fundamentals	What are activation functions? Why are non-linearities needed?	medium	{Python,Fundamentals}	Activation functions introduce non-linearity into a neural network, transforming the weighted sum of inputs into an output for each neuron. Non-linearities are crucial because without them, a multi-layered neural network would simply be equivalent to a single-layer linear model, unable to learn and approximate complex, non-linear relationships present in real-world data.	\N
671	AI Engineer	Python	Fundamentals	Explain CNNs and where they are used.	medium	{Python,Fundamentals}	Convolutional Neural Networks (CNNs) are a class of deep learning models designed to process data with a grid-like topology, such as images. They use convolutional layers to automatically learn hierarchical features, pooling layers for dimensionality reduction, and fully connected layers for classification. CNNs are primarily used in computer vision tasks like image classification, object detection, and facial recognition, but also in natural language processing.	\N
672	AI Engineer	Python	Fundamentals	Explain RNN vs LSTM vs GRU.	hard	{Python,Fundamentals}	RNNs (Recurrent Neural Networks) process sequential data by maintaining an internal state, but struggle with long-term dependencies due to vanishing gradients. LSTMs (Long Short-Term Memory networks) address this with 'gates' (input, forget, output) that control information flow into and out of a cell state, allowing them to capture long-range dependencies effectively. GRUs (Gated Recurrent Units) are a simpler variant of LSTMs with fewer gates (reset, update), offering similar performance with fewer parameters and faster computation.	\N
673	AI Engineer	Python	Fundamentals	What is attention? How does it work?	medium	{Python,Fundamentals}	Attention mechanisms allow neural networks to selectively focus on the most relevant parts of the input sequence when making predictions, rather than processing the entire sequence equally. It works by computing 'attention scores' between elements, which are then used to create a weighted sum of the input representations, effectively highlighting important information and improving performance on tasks like machine translation and text summarization.	\N
674	AI Engineer	Python	Fundamentals	Explain transformers in simple terms.	medium	{Python,Fundamentals}	Transformers are neural network architectures, primarily used in NLP, that process data using powerful self-attention mechanisms. Unlike traditional recurrent models, they can process input sequences in parallel, allowing them to efficiently capture long-range dependencies between words or tokens and significantly accelerate training and performance across various language tasks.	\N
675	AI Engineer	Python	Fundamentals	Why are transformers replacing RNNs?	medium	{Python,Fundamentals}	Transformers are replacing RNNs due to their superior ability to handle long-range dependencies and their parallelization capabilities. Self-attention mechanisms in transformers allow them to weigh the importance of all input elements simultaneously, overcoming RNNs' vanishing gradient problem and sequential processing bottleneck, leading to faster training times and higher performance on complex sequence-to-sequence tasks.	\N
676	AI Engineer	Python	Fundamentals	What is transfer learning? Give an example.	medium	{Python,Fundamentals}	Transfer learning is a machine learning technique where a model pre-trained on a large dataset for a general task is repurposed or fine-tuned for a different, but related, specific task. An example is using an image classification model (like ResNet) pre-trained on ImageNet, then fine-tuning its final layers on a smaller dataset of medical images to detect specific diseases, leveraging the learned features without needing to train from scratch.	\N
678	AI Engineer	Python	Fundamentals	How are LLMs trained (pretraining + finetuning)?	medium	{Python,Fundamentals}	LLMs are trained in two main phases: pretraining and finetuning. Pretraining involves training on massive, diverse datasets using self-supervised tasks (e.g., predicting the next word) to learn general language understanding. Finetuning then adapts the pre-trained model on smaller, task-specific datasets with supervised learning to optimize performance for specific downstream applications, often by adjusting only a subset of its parameters.	\N
679	AI Engineer	Python	Fundamentals	Explain tokenization and why it matters.	medium	{Python,Fundamentals}	Tokenization is the process of breaking down raw text into smaller units called tokens (words, subwords, characters) that an LLM can understand and process. It matters because it transforms human-readable text into a numerical format suitable for model input, influences the model's vocabulary size, and impacts how effectively the model can learn and represent linguistic patterns, directly affecting performance and efficiency.	\N
680	AI Engineer	Python	Fundamentals	What is a context window?	medium	{Python,Fundamentals}	A context window (or context length) refers to the maximum number of tokens an LLM can process or 'attend to' at once as input. It dictates how much information an LLM can consider when generating responses, influencing its ability to maintain coherence over long conversations or documents, with larger windows allowing for better understanding of lengthy texts.	\N
681	AI Engineer	Python	Fundamentals	What is fine-tuning vs prompt engineering vs RAG?	medium	{Python,Fundamentals}	Fine-tuning adapts a pre-trained LLM on a specific dataset for a new task. Prompt engineering crafts effective inputs to guide an LLM's existing knowledge. RAG (Retrieval-Augmented Generation) combines an LLM with external document retrieval to ground responses in factual, external information, reducing hallucinations and improving currency and accuracy of responses without retraining the model.	\N
682	AI Engineer	Python	Fundamentals	What are embeddings? Why do we use them?	medium	{Python,Fundamentals}	Embeddings are dense vector representations of discrete data (like words, sentences, or images) in a continuous vector space, where semantic similarity is captured by vector proximity. We use them to convert complex, high-dimensional data into a numerical format that machine learning models can process effectively, enabling tasks like similarity search, clustering, and semantic understanding.	\N
683	AI Engineer	Python	Fundamentals	How does cosine similarity work in embeddings?	medium	{Python,Fundamentals}	Cosine similarity measures the cosine of the angle between two non-zero vectors in an embedding space. A value close to 1 indicates high similarity (small angle), 0 indicates orthogonality, and -1 indicates complete dissimilarity (opposite direction). It's commonly used to determine how semantically similar two pieces of text or other data are by comparing their corresponding embedding vectors, regardless of their magnitude.	\N
684	AI Engineer	Python	Fundamentals	What is LoRA fine-tuning? Why is it efficient?	hard	{Python,Fundamentals}	LoRA (Low-Rank Adaptation) fine-tuning is a parameter-efficient technique that injects small, trainable low-rank matrices into the attention layers of a pre-trained LLM, keeping the original weights frozen. It's efficient because it drastically reduces the number of parameters that need to be trained and stored for each downstream task, making fine-tuning LLMs more accessible with less computational cost and memory.	\N
685	AI Engineer	Python	Fundamentals	What is quantization? How does it affect performance?	hard	{Python,Fundamentals}	Quantization is the process of reducing the precision of model weights and activations, typically from floating-point (e.g., FP32) to lower bit-width integers (e.g., INT8). It affects performance by significantly reducing model size, memory footprint, and computational cost, leading to faster inference speed and lower power consumption, though it can introduce a slight degradation in model accuracy depending on the bit-width and quantization method used.	\N
686	AI Engineer	Python	Fundamentals	What are hallucinations in LLMs and how to reduce them?	medium	{Python,Fundamentals}	Hallucinations in LLMs refer to the generation of plausible-sounding but factually incorrect or nonsensical information. To reduce them, techniques include improving training data quality, using less confident decoding strategies (e.g., lower temperature), incorporating RAG (Retrieval-Augmented Generation) to ground responses in verified external knowledge, and fine-tuning with human feedback (RLHF) to align outputs with factual correctness.	\N
687	AI Engineer	Python	Fundamentals	What is RAG and why is it important?	medium	{Python,Fundamentals}	RAG (Retrieval-Augmented Generation) is an architecture that enhances LLM responses by first retrieving relevant information from an external knowledge base and then conditioning the LLM's generation on that retrieved content. It's important for reducing hallucinations, providing access to up-to-date and domain-specific information, and increasing the trustworthiness and accuracy of LLM outputs by grounding them in verifiable sources.	\N
688	AI Engineer	Python	Fundamentals	Explain how a vector database works.	medium	{Python,Fundamentals}	A vector database stores data as high-dimensional numerical vectors (embeddings) generated from various data types like text or images. It works by indexing these vectors and enabling fast similarity searches, allowing users to query using a vector and retrieve items with similar semantic meaning by comparing their vector representations using distance metrics like cosine similarity.	\N
689	AI Engineer	Python	Fundamentals	What is chunking? What strategies are used?	medium	{Python,Fundamentals}	Chunking is the process of breaking down large documents or data into smaller, manageable segments (chunks) before embedding them for retrieval. Strategies include fixed-size chunking (e.g., 256 tokens), content-aware chunking (splitting by paragraphs or headings), and recursive chunking (breaking down large chunks until a certain size), aiming to preserve contextual integrity within each chunk while keeping them within embedding model limits.	\N
690	AI Engineer	Python	Fundamentals	What is the difference between BM25 search and vector search?	medium	{Python,Fundamentals}	BM25 search is a statistical keyword-based retrieval algorithm that ranks documents based on term frequency and inverse document frequency, favoring exact keyword matches and short documents. Vector search, based on embeddings, retrieves documents semantically similar to a query by comparing their vector representations, allowing for conceptual matching even without exact keyword overlap. BM25 is good for precision on exact terms, while vector search excels at understanding intent and synonymy.	\N
691	AI Engineer	Python	Fundamentals	How do you evaluate a RAG system?	hard	{Python,Fundamentals}	Evaluating a RAG system involves assessing both retrieval quality and generation quality. Retrieval quality metrics include recall (relevant chunks found) and precision (chunks found are relevant). Generation quality is measured by faithfulness (consistency with retrieved facts), answer relevance (to the query), and overall correctness or helpfulness, often using human evaluation, RAG-specific metrics (e.g., RAGAS), or LLM-as-a-judge approaches.	\N
692	AI Engineer	Python	Fundamentals	What is hybrid search?	medium	{Python,Fundamentals}	Hybrid search combines multiple search techniques, typically keyword-based search (like BM25) and vector-based semantic search, to leverage the strengths of both. This approach aims to improve retrieval effectiveness by capturing both precise keyword matches and broader semantic relevance, leading to more comprehensive and accurate results, especially for complex or nuanced queries.	\N
693	AI Engineer	Python	Fundamentals	What is reranking and when is it useful?	medium	{Python,Fundamentals}	Reranking is a post-retrieval step where an initial set of retrieved documents or chunks is re-ordered based on a more sophisticated relevance model, often an LLM-based cross-encoder, to improve the final ranking. It's useful when the initial retrieval (e.g., vector search) returns a broad set of potentially relevant items, but a deeper understanding of context or nuance is needed to surface the truly most relevant ones to the top.	\N
694	AI Engineer	Python	Fundamentals	What makes a good retrieval pipeline?	medium	{Python,Fundamentals}	A good retrieval pipeline is characterized by effective data preprocessing (chunking, metadata), robust embedding models that capture semantic nuances, efficient vector indexing and search, and often a reranking step to refine results. It should consistently retrieve accurate, relevant, and contextually complete information efficiently, minimizing irrelevant noise and providing sufficient context for the LLM to generate high-quality, grounded responses.	\N
695	AI Engineer	Python	Fundamentals	Explain the impact of embedding model choice.	hard	{Python,Fundamentals}	The choice of embedding model profoundly impacts a RAG system's performance, as it determines how text is semantically represented. A good embedding model captures subtle meanings, synonyms, and context, leading to more accurate retrieval of relevant chunks. A poor choice can result in irrelevant or missed relevant documents, severely hindering the LLM's ability to generate grounded responses, directly affecting the system's overall accuracy and utility.	\N
696	AI Engineer	Python	Fundamentals	How do you minimize context-based hallucinations in RAG?	medium	{Python,Fundamentals}	To minimize context-based hallucinations in RAG, focus on retrieving highly relevant and sufficient context through robust chunking strategies, high-quality embedding models, and effective reranking. Also, ensure the LLM is explicitly instructed to 'answer only based on the provided context' and incorporate confidence scores or uncertainty estimation to flag potentially ungrounded generations.	\N
697	AI Engineer	Python	System Design	What is model drift and how do you detect it?	medium	{Python,"System Design",Fundamentals}	Model drift occurs when a deployed model's performance degrades over time because the relationship between input features and target variable changes (concept drift) or the distribution of input data changes (data drift). It's detected by continuously monitoring key performance metrics, input feature distributions, and prediction distributions, often using statistical tests or control charts to flag significant deviations from baseline.	\N
698	AI Engineer	Python	System Design	How do you monitor AI/LLM systems in production?	medium	{Python,"System Design",Fundamentals}	Monitoring AI/LLM systems in production involves tracking model performance (accuracy, latency), data quality (input data drift, schema changes), model quality (prediction drift, hallucination rate for LLMs), and infrastructure metrics (CPU, memory, GPU utilization). This is typically done through dashboards, alerting systems, and logging mechanisms, often requiring specialized MLOps tools to detect degradation, drift, or failures.	\N
699	AI Engineer	Python	System Design	What is a feature store? Why is it needed?	medium	{Python,"System Design",Fundamentals}	A feature store is a centralized repository that manages and serves machine learning features, ensuring consistency between training and inference environments. It's needed to prevent data leakage, reduce feature engineering duplication, ensure feature freshness, and streamline the MLOps lifecycle by providing a single source of truth for features, accelerating model development and deployment.	\N
700	AI Engineer	Python	System Design	Explain the ML lifecycle end-to-end.	medium	{Python,"System Design",Fundamentals}	The ML lifecycle typically includes: Problem Definition & Data Acquisition, Data Preparation (cleaning, feature engineering), Model Training & Evaluation, Model Deployment (packaging, serving), and Continuous Monitoring & Retraining. This iterative process ensures models are developed, maintained, and perform effectively in production, adapting to changing data or requirements.	\N
701	AI Engineer	Python	System Design	How do you structure a training pipeline?	medium	{Python,"System Design",Fundamentals}	A robust training pipeline typically involves modular steps: data ingestion, data validation and preprocessing, feature engineering, model selection and hyperparameter tuning, model training, evaluation (with cross-validation), and model registration. Each step should be automated, version-controlled, and reproducible, often using orchestration tools like Airflow or Kubeflow to manage dependencies and execution flow.	\N
702	AI Engineer	Python	System Design	What is model versioning and why is it important?	medium	{Python,"System Design",Fundamentals}	Model versioning is the practice of tracking and managing different iterations of machine learning models, along with their associated data, code, and hyperparameters. It's important for reproducibility, allowing teams to roll back to previous versions, compare performance, and ensure consistent deployments, especially in regulated environments or when troubleshooting issues in production.	\N
703	AI Engineer	Python	System Design	What is CI/CD for ML systems?	medium	{Python,"System Design",Fundamentals}	CI/CD for ML systems (MLOps) extends traditional software CI/CD by integrating automated testing, building, and deployment across the entire ML lifecycle. CI ensures new code integrates smoothly and models are re-evaluated, while CD automates the deployment of validated models into production, ensuring rapid, reliable updates and continuous improvement of ML applications.	\N
704	AI Engineer	Python	System Design	What is data lineage?	medium	{Python,"System Design",Fundamentals}	Data lineage refers to the lifecycle of data, tracking its origin, transformations, and movements from source to destination. In ML, it's crucial for understanding how training data was prepared, what changes it underwent, and how it impacted model outputs, enabling debugging, ensuring compliance, and building trust in data and models.	\N
705	AI Engineer	Python	System Design	What is an inference pipeline?	medium	{Python,"System Design",Fundamentals}	An inference pipeline is a series of automated steps that take raw input data, preprocess it into features, feed it to a trained machine learning model to generate predictions, and then post-process these predictions for end-users. It focuses on serving models in production efficiently, ensuring low latency and high throughput for real-time or batch predictions.	\N
706	AI Engineer	Python	System Design	How do you scale AI inference (batching, caching, quantization, distillation)?	hard	{Python,"System Design",Fundamentals}	Scaling AI inference involves strategies like batching multiple requests for parallel processing, caching frequently accessed results to avoid re-computation, quantization to reduce model size and accelerate computation using lower precision data types, and model distillation where a smaller 'student' model learns from a larger 'teacher' model for faster, more efficient inference with minimal performance loss.	\N
707	AI Engineer	Python	Fundamentals	Explain the difference between bias and variance. How do they affect model performance?	medium	{Python,Fundamentals}	Bias is the error due to overly simplistic model assumptions, leading to underfitting. Variance is the error due to a model's excessive sensitivity to training data fluctuations, causing overfitting. They form the bias-variance trade-off, where an optimal model balances both to achieve good generalization on unseen data.	\N
708	AI Engineer	Python	Fundamentals	What is regularization? Compare L1 and L2 regularization and their impact on model weights.	medium	{Python,Fundamentals}	Regularization prevents overfitting by adding a penalty to the loss function based on model complexity. L1 (Lasso) regularization adds the sum of absolute values of coefficients, promoting sparsity and feature selection by driving some weights to exactly zero. L2 (Ridge) regularization adds the sum of squared values of coefficients, shrinking weights towards zero without eliminating them, thus reducing their magnitude and improving generalization.	\N
709	AI Engineer	Python	Fundamentals	How does gradient descent work? Explain stochastic, mini-batch, and batch gradient descent.	medium	{Python,Fundamentals}	Gradient descent is an optimization algorithm that iteratively adjusts model parameters in the direction opposite to the gradient of the loss function to find its minimum. Batch GD uses the entire dataset for one update, Stochastic GD updates per single sample, and Mini-batch GD updates per small batch of samples, offering a balance between speed and stability, making it the most common approach.	\N
710	AI Engineer	Python	Fundamentals	Explain the curse of dimensionality and how it impacts machine learning algorithms.	hard	{Python,Fundamentals}	The curse of dimensionality refers to various phenomena that arise when analyzing and organizing data in high-dimensional spaces, becoming increasingly sparse and difficult to effectively model. This leads to increased computational cost, difficulty in finding meaningful patterns due to sparse data, and a higher risk of overfitting for ML algorithms that require sufficient data points to generalize well.	\N
711	AI Engineer	Python	Fundamentals	Derive the closed-form solution for linear regression.	hard	{Python,Fundamentals}	The closed-form solution for linear regression, also known as the Normal Equation, minimizes the sum of squared errors directly by setting the gradient of the cost function with respect to the parameters to zero. For a design matrix X and target vector y, the optimal weights β (or θ) are given by the formula: β = (X^T X)^-1 X^T y.	\N
712	AI Engineer	Python	Fundamentals	Explain why random forests reduce variance and how they differ from boosting algorithms.	hard	{Python,Fundamentals}	Random Forests reduce variance by averaging predictions from multiple decision trees, each trained on bootstrapped samples of data and random subsets of features (bagging), making the ensemble robust to individual tree's overfitting. Boosting algorithms, conversely, sequentially build weak learners where each subsequent model tries to correct the errors of the previous ones, focusing on misclassified instances to reduce bias and improve overall accuracy.	\N
713	AI Engineer	Python	Fundamentals	What is vanishing and exploding gradient problem? How do LSTM and Batch Normalization help?	medium	{Python,Fundamentals}	Vanishing gradients occur when gradients become extremely small during backpropagation, preventing deep layers from learning, while exploding gradients cause updates to become too large, leading to divergence. LSTMs mitigate vanishing gradients using gates to control information flow and maintain long-term dependencies. Batch Normalization stabilizes training by normalizing activations within each mini-batch, combating both issues and allowing higher learning rates.	\N
714	AI Engineer	Python	Fundamentals	Explain ReLU, Leaky ReLU, and ELU activation functions. When would you prefer each?	medium	{Python,Fundamentals}	ReLU outputs 'x' for x>0 and '0' otherwise, solving vanishing gradients for positive inputs but can suffer from 'dying ReLUs'. Leaky ReLU introduces a small slope for negative inputs (e.g., 0.01x), preventing dying ReLUs. ELU outputs 'x' for x>0 and 'α(e^x - 1)' for x<=0, providing negative outputs that push mean activations closer to zero, leading to faster learning and better generalization.	\N
715	AI Engineer	Python	Fundamentals	What is dropout, and how does it prevent overfitting?	medium	{Python,Fundamentals}	Dropout is a regularization technique where, during training, a randomly selected fraction of neurons are temporarily 'dropped out' (i.e., their outputs are set to zero). This forces the network to learn more robust features that are not dependent on specific neurons, preventing complex co-adaptations and effectively training an ensemble of thinned networks to reduce overfitting.	\N
716	AI Engineer	Python	Fundamentals	Explain the working of transformers. How does self-attention work?	hard	{Python,Fundamentals}	Transformers are neural network architectures primarily based on the self-attention mechanism, allowing the model to weigh the importance of different words in an input sequence when encoding a particular word, capturing long-range dependencies efficiently. Self-attention calculates query, key, and value vectors for each token, then computes attention scores by dot-producting query with keys, normalizing them with softmax, and applying to values to create a weighted sum of information from all tokens.	\N
717	AI Engineer	Python	Fundamentals	Compare CNN, RNN, and Transformer architectures in terms of their strengths and weaknesses.	hard	{Python,Fundamentals}	CNNs excel with spatial data (images) due to local receptive fields and parameter sharing, efficient for local features. RNNs are designed for sequential data, processing elements one by one with memory, good for short-range temporal dependencies but suffer from vanishing gradients. Transformers, using self-attention, capture long-range dependencies across sequences efficiently and are highly parallelizable, overcoming RNNs' sequential bottleneck but requiring more data and computational power.	\N
718	AI Engineer	Python	Fundamentals	How does backpropagation through time (BPTT) work in RNNs?	hard	{Python,Fundamentals}	Backpropagation Through Time (BPTT) is the algorithm used to train recurrent neural networks (RNNs) by unfolding the recurrent network over time into a feedforward network. It then applies the standard backpropagation algorithm to this unrolled network, calculating gradients by summing up contributions from each time step, allowing the error to propagate back through the entire sequence to update weights.	\N
719	AI Engineer	Python	Fundamentals	Difference between word embeddings (Word2Vec, GloVe) and contextual embeddings (BERT, GPT)?	medium	{Python,Fundamentals}	Word embeddings (Word2Vec, GloVe) provide a static, fixed vector representation for each word regardless of context, capturing semantic relationships based on co-occurrence statistics. Contextual embeddings (BERT, GPT) generate dynamic, context-aware representations, where a word's vector changes based on its surrounding words in a sentence, capturing polysemy and nuanced meanings, which significantly improves performance in many NLP tasks.	\N
720	AI Engineer	Python	Fundamentals	What is tokenization? Compare subword, word, and character tokenization.	medium	{Python,Fundamentals}	Tokenization is the process of breaking down raw text into smaller units called tokens. Word tokenization splits text by whitespace and punctuation, treating each word as a token. Character tokenization considers each character a token, useful for languages without clear word boundaries. Subword tokenization (e.g., BPE, WordPiece) splits rare words into common subword units, balancing vocabulary size with handling out-of-vocabulary words, commonly used in modern NLP models.	\N
721	AI Engineer	Python	Fundamentals	Explain sequence-to-sequence models with attention.	medium	{Python,Fundamentals}	Sequence-to-sequence models consist of an encoder (processing input sequence into a context vector) and a decoder (generating output sequence). Attention mechanisms enhance this by allowing the decoder to selectively 'focus' on relevant parts of the input sequence at each decoding step, instead of relying on a single fixed-size context vector. This overcomes the bottleneck for long sequences, significantly improving performance in tasks like machine translation.	\N
722	AI Engineer	Python	Fundamentals	Explain masked language modeling vs causal language modeling.	hard	{Python,Fundamentals}	Masked Language Modeling (MLM), used by BERT, trains a model to predict masked tokens in a sentence by considering context from both left and right, enabling a bidirectional understanding of text. Causal Language Modeling (CLM), used by GPT, trains a model to predict the next token in a sequence based only on preceding tokens, allowing for autoregressive text generation and next-word prediction.	\N
723	AI Engineer	Python	Fundamentals	How does positional encoding in Transformers work mathematically?	hard	{Python,Fundamentals}	Positional encodings are added to word embeddings in Transformers to inject information about the relative or absolute position of tokens, as self-attention is permutation-invariant. Mathematically, it's typically done using sine and cosine functions of different frequencies: `PE(pos, 2i) = sin(pos / 10000^(2i/d_model))` and `PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))`, where `pos` is the token's position and `i` is the dimension index.	\N
724	AI Engineer	Python	Fundamentals	What are common challenges in NER (Named Entity Recognition) and how do transformer-based models address them?	hard	{Python,Fundamentals}	Common NER challenges include context dependency (e.g., 'Apple' as company vs. fruit), entity ambiguity, domain specificity, and handling out-of-vocabulary entities. Transformer-based models address these by using self-attention to capture long-range dependencies and contextual information, allowing them to better disambiguate entities based on the entire sentence, and leveraging large pre-trained models for better generalization across domains.	\N
725	AI Engineer	Python	Fundamentals	Explain convolution, pooling, and padding in CNNs.	medium	{Python,Fundamentals}	Convolution extracts features by sliding a filter (kernel) over the input, performing element-wise multiplication and summing to create feature maps. Pooling (e.g., max pooling) reduces spatial dimensions, providing translation invariance and computational efficiency. Padding adds zeros around the input border to preserve spatial dimensions after convolution, preventing information loss at edges and controlling output size.	\N
726	AI Engineer	Python	Fundamentals	Difference between semantic segmentation, instance segmentation, and object detection.	medium	{Python,Fundamentals}	Object detection identifies objects within an image and draws bounding boxes around them. Semantic segmentation classifies each pixel in an image to a category (e.g., 'car,' 'road') without distinguishing individual instances. Instance segmentation, more granular, identifies each pixel with an object class AND distinguishes between individual instances of that class (e.g., 'car 1,' 'car 2').	\N
727	AI Engineer	Python	Fundamentals	What is transfer learning, and how is it applied in CV tasks?	medium	{Python,Fundamentals}	Transfer learning leverages knowledge gained from a model pre-trained on a large dataset (e.g., ImageNet) for a new, often smaller, related task. In CV, this involves taking a pre-trained CNN, freezing its convolutional layers (feature extractors), and replacing/retraining the final classification layers for the specific new task. This significantly reduces training time and data requirements, especially for limited datasets.	\N
728	AI Engineer	Python	Fundamentals	Explain YOLO vs Faster R-CNN architectures for object detection.	hard	{Python,Fundamentals}	YOLO (You Only Look Once) is a single-stage detector that predicts bounding boxes and class probabilities directly from the full image in one forward pass, making it extremely fast and suitable for real-time applications. Faster R-CNN is a two-stage detector; first, a Region Proposal Network (RPN) generates region proposals, and then a Fast R-CNN head classifies and refines these proposals, offering higher accuracy but generally slower inference speeds compared to YOLO.	\N
729	AI Engineer	Python	Fundamentals	What is a GAN (Generative Adversarial Network)? Explain generator and discriminator training.	hard	{Python,Fundamentals}	A GAN consists of a Generator (G) that creates fake data from random noise, and a Discriminator (D) that tries to distinguish between real and fake data. G is trained to fool D by making generated data look realistic, while D is trained to correctly classify real vs. fake. They play a min-max game, iteratively improving until G produces highly realistic data and D can no longer tell the difference, effectively learning the data distribution.	\N
730	AI Engineer	Python	Fundamentals	How does attention mechanism apply in vision (e.g., Vision Transformers)?	hard	{Python,Fundamentals}	Attention mechanisms in vision, exemplified by Vision Transformers (ViTs), allow models to focus on relevant parts of an image, similar to how transformers work with text. ViTs split an image into patches, linearly embed them, add positional encodings, and then process them using a standard Transformer encoder, where self-attention layers compute relationships between different image patches, enabling global feature extraction unlike CNNs' local receptive fields.	\N
731	AI Engineer	Python	Fundamentals	Explain the difference between PDF and CDF.	medium	{Python,Fundamentals}	The Probability Density Function (PDF) describes the relative likelihood for a continuous random variable to take on a given value; its integral over a range gives the probability within that range. The Cumulative Distribution Function (CDF) gives the probability that a random variable X will take a value less than or equal to x, defined as the integral of the PDF from negative infinity to x, always non-decreasing from 0 to 1.	\N
732	AI Engineer	Python	Fundamentals	What is Bayes’ theorem, and give an AI application.	medium	{Python,Fundamentals}	Bayes' theorem describes the probability of an event based on prior knowledge of conditions that might be related to the event: P(A|B) = [P(B|A) * P(A)] / P(B). An AI application is spam filtering, where P(spam|word) can be calculated based on P(word|spam) and P(spam) to determine if an email containing certain words is likely spam, effectively classifying emails.	\N
733	AI Engineer	Python	Fundamentals	Explain KL divergence and its role in variational autoencoders.	hard	{Python,Fundamentals}	KL divergence (Kullback-Leibler divergence) measures how one probability distribution P diverges from a second, expected probability distribution Q. In Variational Autoencoders (VAEs), KL divergence is used as a regularization term in the loss function to ensure that the latent distribution learned by the encoder stays close to a simple prior distribution (e.g., a standard normal distribution), enabling smooth interpolation and meaningful sampling from the latent space.	\N
734	AI Engineer	Python	Fundamentals	Derive the gradient of the softmax function.	hard	{Python,Fundamentals}	The softmax function transforms a vector of real numbers into a probability distribution. The gradient of the softmax function with respect to its input `z_k` is `softmax(z)_k * (δ_jk - softmax(z)_j)`, where `δ_jk` is the Kronecker delta (1 if j=k, 0 otherwise). This results in a Jacobian matrix where diagonal elements are `s_k(1-s_k)` and off-diagonal elements are `-s_j s_k`, crucial for backpropagation in classification tasks.	\N
735	AI Engineer	Python	Fundamentals	Explain eigenvalues and eigenvectors and their relevance in PCA.	hard	{Python,Fundamentals}	Eigenvalues and eigenvectors represent special directions (eigenvectors) along which a linear transformation acts by simply scaling (eigenvalues), without changing direction. In PCA (Principal Component Analysis), eigenvectors of the covariance matrix represent the principal components – the directions of maximum variance in the data. Their corresponding eigenvalues quantify the amount of variance explained along each principal component, allowing for dimensionality reduction by selecting components with the largest eigenvalues.	\N
736	AI Engineer	Python	System Design	How do you handle class imbalance in real-world datasets?	medium	{Python,"System Design"}	To handle class imbalance, techniques include oversampling the minority class (e.g., SMOTE), undersampling the majority class, using cost-sensitive learning (assigning higher weights to minority class errors in the loss function), or employing ensemble methods like Balanced Random Forests. The choice depends on dataset size, the severity of imbalance, and the specific problem's sensitivity to false positives vs. false negatives.	\N
737	AI Engineer	Python	System Design	What are precision, recall, F1-score, and when would you prefer each metric?	medium	{Python,"System Design"}	Precision measures the proportion of true positive predictions among all positive predictions, preferred when minimizing false positives is critical (e.g., spam detection). Recall measures the proportion of true positive predictions among all actual positives, preferred when minimizing false negatives is critical (e.g., disease detection). F1-score is the harmonic mean of precision and recall, providing a balanced metric when both are important, especially with imbalanced classes.	\N
738	AI Engineer	Python	System Design	Explain cross-validation and why it is important.	medium	{Python,"System Design"}	Cross-validation is a technique to assess how the results of a statistical analysis will generalize to an independent dataset, providing a more robust estimate of model performance. It involves partitioning the data into multiple folds, training the model on a subset of folds, and evaluating it on the remaining fold, repeating this process for all folds. This helps detect overfitting and provides a more reliable performance estimate than a single train-test split.	\N
739	AI Engineer	Python	System Design	How would you deploy a large NLP model like GPT in production efficiently?	hard	{Python,"System Design",API}	Efficient deployment involves model quantization (reducing precision), distillation (training a smaller student model), pruning (removing redundant weights), and using optimized inference engines (e.g., NVIDIA TensorRT, ONNX Runtime). Deploying via containerization (Docker) and orchestration (Kubernetes) on GPU-accelerated cloud instances (e.g., AWS SageMaker, Azure ML) with robust API endpoints and caching mechanisms ensures scalability, low-latency inference, and cost-effectiveness.	\N
740	AI Engineer	Python	System Design	Explain model drift and how to monitor it in a production environment.	hard	{Python,"System Design"}	Model drift occurs when the relationship between input features and the target variable changes over time, causing a deployed model's performance to degrade. Monitoring involves tracking model predictions, input data distributions (data drift), and ground truth labels (concept drift) using metrics like Population Stability Index (PSI), A/B testing, or comparing live performance against baselines. Alerts are triggered if significant shifts or performance drops are detected, prompting retraining or recalibration.	\N
741	AI Engineer	Python	System Design	How would you design a recommendation system for a streaming platform with millions of users?	hard	{Python,"System Design",API}	A recommendation system for millions of users would combine collaborative filtering (user-item interactions, matrix factorization) and content-based filtering (item metadata, user profiles), potentially with hybrid approaches. Key considerations include real-time inference, scalability, cold-start handling, and A/B testing for optimization. Architecturally, it would involve a data ingestion pipeline, distributed feature engineering, model training on large-scale data (e.g., Spark), a low-latency serving layer (e.g., Redis for recommendations lookup), and a robust feedback loop for continuous improvement.	\N
742	AI Engineer	Python	Coding	Find shortest path in unweighted graph.	medium	{Coding,Fundamentals,Python}	The shortest path in an unweighted graph can be efficiently found using Breadth-First Search (BFS). BFS explores all neighbors at the current depth level before moving to the next, guaranteeing the first time a node is reached, it's via the shortest path from the source.	from collections import deque\n\ndef shortest_path_unweighted(graph, start, end):\n    queue = deque([(start, [start])])\n    visited = {start}\n    while queue:\n        current_node, path = queue.popleft()\n        if current_node == end:\n            return path\n        for neighbor in graph.get(current_node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append((neighbor, path + [neighbor]))\n    return None
743	AI Engineer	Python	Coding	Detect cycle in a graph.	medium	{Coding,Fundamentals,Python}	For an undirected graph, a cycle can be detected using DFS by keeping track of visited nodes and the parent of the current node. If DFS encounters an already visited node that is not the direct parent, a cycle exists. For directed graphs, an additional recursion stack is used to identify back edges.	def detect_cycle_undirected(graph):\n    visited = set()\n    def dfs(node, parent):\n        visited.add(node)\n        for neighbor in graph.get(node, []):\n            if neighbor == parent: # Skip parent link in undirected graph\n                continue\n            if neighbor in visited: # Found a back edge to a visited, non-parent node\n                return True\n            if dfs(neighbor, node): # Recurse\n                return True\n        return False\n\n    for node in graph:\n        if node not in visited:\n            if dfs(node, None): # Start DFS from unvisited nodes\n                return True\n    return False
744	AI Engineer	Python	Coding	Dynamic programming: Fibonacci number.	easy	{Coding,Fundamentals,Python}	Fibonacci numbers can be computed efficiently using dynamic programming (memoization or tabulation) to avoid redundant calculations. Memoization stores results of subproblems in a cache (e.g., a dictionary) to return instantly if already computed.	def fib_dp(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib_dp(n-1, memo) + fib_dp(n-2, memo)\n    return memo[n]\n\n# Tabulation approach\ndef fib_tabulation(n):\n    if n <= 1: return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]
745	AI Engineer	Python	Coding	Longest common subsequence (LCS).	hard	{Coding,Fundamentals,Python}	LCS is a classic dynamic programming problem solved by building a 2D table. The value `dp[i][j]` represents the length of the LCS of `text1[0...i-1]` and `text2[0...j-1]`. If characters match, it's `1 + dp[i-1][j-1]`; otherwise, it's the maximum of `dp[i-1][j]` and `dp[i][j-1]`.	def longest_common_subsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = 1 + dp[i-1][j-1]\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]
746	AI Engineer	Python	Coding	Implement a basic calculator (string expression evaluation).	hard	{Coding,Python}	A basic calculator can be implemented using a stack-based approach to handle operator precedence and parentheses. Iterate through the string, pushing numbers and operators onto respective stacks, resolving operations based on precedence rules as needed, then performing final calculations.	def calculate(s: str) -> int:\n    num, stack, sign = 0, [], 1\n    res = 0\n    for c in s:\n        if c.isdigit():\n            num = num * 10 + int(c)\n        elif c == '+':\n            res += num * sign\n            num = 0\n            sign = 1\n        elif c == '-':\n            res += num * sign\n            num = 0\n            sign = -1\n        elif c == '(':\n            stack.append(res)\n            stack.append(sign)\n            res = 0\n            sign = 1\n        elif c == ')':\n            res += num * sign\n            num = 0\n            res *= stack.pop()  # Pop sign\n            res += stack.pop()  # Pop previous result\n    res += num * sign\n    return res
747	AI Engineer	Python	Behavioral	Tell me about yourself.	easy	{Fundamentals}	I'm a passionate AI Engineer with experience in Python and machine learning, keen on building robust and scalable solutions. My background blends strong technical skills with a drive for continuous learning and problem-solving, making me eager to contribute to innovative projects.	\N
748	AI Engineer	Python	Behavioral	Why do you want to work here?	easy	{Fundamentals}	I'm drawn to [Company Name]'s innovative work in [specific area, e.g., AI research/product], which aligns perfectly with my passion for [e.g., developing intelligent systems]. I admire your commitment to [company value, e.g., collaboration/impact] and see this as an exciting opportunity to grow and make a significant contribution.	\N
749	AI Engineer	Python	Behavioral	Strengths and weaknesses.	easy	{Fundamentals}	My core strength lies in my analytical problem-solving skills and my ability to quickly learn new technologies, which is crucial in AI. A weakness I'm actively addressing is sometimes focusing too much on minute details, which I'm balancing by practicing broader strategic thinking and effective delegation.	\N
750	AI Engineer	Python	Behavioral	Describe a challenge you faced and how you handled it.	easy	{Fundamentals}	In a recent project, we encountered unexpected performance bottlenecks with a model. I tackled this by systematically profiling the code, researching alternative optimization techniques, and collaborating with the team to implement a more efficient architecture, ultimately meeting our performance targets ahead of schedule.	\N
751	AI Engineer	Python	Behavioral	Tell me about a time you failed.	easy	{Fundamentals}	I once underestimated the complexity of integrating a new AI library, leading to a missed deadline. I learned the importance of thorough upfront research and realistic timeline planning, and now I proactively seek early feedback and conduct phased implementations to mitigate similar risks.	\N
753	AI Engineer	Python	Behavioral	Describe a situation where you showed leadership.	easy	{Fundamentals}	During a critical phase of a project, I took the initiative to organize daily stand-ups, define clear tasks, and mentor a junior team member on a complex algorithm. This proactive approach helped streamline our efforts, resolve blockers efficiently, and ensure we delivered the project successfully.	\N
754	AI Engineer	Python	Behavioral	How do you prioritize tasks?	easy	{Fundamentals}	I prioritize tasks by assessing urgency and impact, often using methods like the Eisenhower Matrix. I communicate regularly with stakeholders to ensure alignment on priorities, adjust as needed, and break down large tasks into manageable steps to maintain progress and meet deadlines effectively.	\N
755	AI Engineer	Python	Behavioral	Tell me about a time you worked under pressure.	easy	{Fundamentals}	Facing a tight deadline for a product launch, I focused on clearly defining critical path tasks and delegating effectively. By maintaining calm, communicating constantly with the team, and breaking down the problem, we successfully launched on time with a high-quality product, demonstrating resilience and efficiency.	\N
756	AI Engineer	Python	Behavioral	How do you handle criticism?	easy	{Fundamentals}	I view criticism as a valuable opportunity for growth. I listen carefully to understand the feedback, ask clarifying questions to ensure I grasp the core issue, and then reflect on how I can improve. My goal is always to learn from it and apply the insights to enhance my performance.	\N
757	AI Engineer	Python	Behavioral	Describe a time you disagreed with a manager.	easy	{Fundamentals}	I once disagreed with my manager's proposed technical approach for a new feature. I respectfully presented my alternative, backed by data and a clear explanation of its benefits and potential risks of the current plan. We discussed it openly, and ultimately, my manager appreciated the perspective, leading to a revised and improved strategy.	\N
758	AI Engineer	Python	Behavioral	Where do you see yourself in 5 years?	easy	{Fundamentals}	In five years, I envision myself as a senior AI Engineer, leading challenging projects and contributing significantly to the development of cutting-edge AI solutions. I aim to deepen my expertise in [specific AI field, e.g., MLOps/NLP] and potentially mentor junior engineers, while continuously learning and adapting to new technologies.	\N
759	AI Engineer	Python	Behavioral	Why should we hire you?	easy	{Fundamentals}	You should hire me because I bring a unique blend of strong technical skills in Python and AI, a proven track record of solving complex problems, and a proactive, collaborative mindset. I'm not just looking for a job; I'm eager to contribute meaningfully to your team's success and grow alongside the company.	\N
760	AI Engineer	Python	Behavioral	Tell me about a time you solved a difficult problem.	easy	{Fundamentals}	We faced a critical bug in a production AI model that was difficult to reproduce. I meticulously debugged, analyzing logs and model outputs, and hypothesized a subtle data pre-processing error. My persistent investigation led to identifying and fixing the root cause, restoring model accuracy and stability.	\N
761	AI Engineer	Python	Behavioral	How do you handle mistakes at work?	easy	{Fundamentals}	When I make a mistake, my first step is to take ownership and immediately inform relevant stakeholders. Then, I focus on understanding why it happened, rectifying it efficiently, and implementing preventative measures to ensure it doesn't recur. I see mistakes as valuable learning experiences.	\N
762	AI Engineer	Python	Behavioral	Describe a time you learned something quickly.	easy	{Fundamentals}	To accelerate a project, I needed to quickly learn a new cloud-based MLOps platform. I immersed myself in documentation, online courses, and hands-on experiments, applying the concepts directly to our project, and became proficient enough to contribute effectively within a couple of weeks.	\N
763	AI Engineer	Python	Behavioral	How do you stay motivated?	easy	{Fundamentals}	I stay motivated by continuously seeking challenging problems and learning opportunities. Breaking down large goals into smaller, achievable milestones and celebrating those successes helps, as does seeing the impact of my work. The dynamic nature of AI also fuels my curiosity and drive.	\N
764	AI Engineer	Python	Behavioral	Have you ever taken initiative in a project?	easy	{Fundamentals}	Yes, in a recent project, I noticed a lack of standardized testing for our AI models. I proactively researched and proposed a robust testing framework, developed initial test cases, and successfully advocated for its adoption, significantly improving our model reliability and development workflow.	\N
765	AI Engineer	Python	Behavioral	Tell me about a time you managed multiple projects.	easy	{Fundamentals}	I once managed two overlapping AI development projects with competing deadlines. I leveraged strong organizational skills, clear communication with both teams, and agile methodologies to prioritize tasks, allocate resources effectively, and ensure both projects progressed smoothly towards successful completion.	\N
766	AI Engineer	Python	Behavioral	How do you handle tight deadlines?	easy	{Fundamentals}	When faced with tight deadlines, I immediately break down the project into its most critical components, prioritize ruthlessly, and communicate transparently with the team and stakeholders about what's achievable. I focus on efficiency, avoid perfectionism where possible, and collaborate closely to meet the essential requirements.	\N
767	AI Engineer	Python	Behavioral	Describe teamwork experience.	easy	{Fundamentals}	In my previous role, I was part of a cross-functional team developing an intelligent recommendation system. I collaborated closely with data scientists on model development and with front-end engineers for API integration, regularly sharing progress and providing feedback, which resulted in a cohesive and successful product launch.	\N
768	AI Engineer	Python	Behavioral	Give an example of creative problem solving.	easy	{Fundamentals}	We needed to generate synthetic data for a rare edge case in our computer vision model but lacked real-world examples. I devised a method to creatively augment existing data by combining elements from various sources and applying transformations, effectively generating realistic synthetic samples that significantly improved model robustness.	\N
769	AI Engineer	Python	Behavioral	What’s your approach to learning new technologies?	easy	{Fundamentals}	My approach is hands-on and iterative. I start with official documentation and tutorials to grasp the fundamentals, then immediately apply what I learn through small projects or experiments. I also seek out community resources and discussions to understand best practices and real-world applications.	\N
770	AI Engineer	Python	Behavioral	How do you handle ambiguity?	easy	{Fundamentals}	I embrace ambiguity by breaking down the problem into smaller, clearer components and seeking clarification from stakeholders. If direct answers aren't available, I propose hypotheses, validate assumptions through experiments or research, and iterate towards a solution, always ensuring transparency about uncertainties.	\N
771	AI Engineer	Python	Behavioral	Tell me about a time you went above and beyond.	easy	{Fundamentals}	During a crucial deployment, I volunteered to stay late and monitor the system post-launch, proactively addressing minor issues that arose. This ensured a smooth transition, prevented potential downtime, and demonstrated my commitment to the project's success beyond my core responsibilities.	\N
772	Generative AI Engineer (GenAI)	Python	System Design	Tell me about a time you solved a difficult AI/ML problem. What steps did you take?	hard	{Python,"System Design",Coding}	I faced a challenge with a generative adversarial network (GAN) failing to converge for high-resolution image synthesis. My approach involved a systematic diagnosis: analyzing gradient flow, experimenting with different loss functions (e.g., Wasserstein GAN with gradient penalty), and tuning hyperparameters meticulously. This iterative process, guided by quantitative metrics and qualitative output analysis, ultimately led to stable training and superior image quality.	\N
773	Generative AI Engineer (GenAI)	Python	System Design	Describe a project where your generative model didn’t work as expected. How did you fix it?	hard	{Python,"System Design",Coding}	In a text-to-image diffusion model project, the generated outputs were often blurry or lacked coherence. I identified this as a sampling issue, suggesting an exploration of different noise schedules and sampler variants (like DPM-Solver). After extensive experimentation, switching to an adaptive noise schedule and a more robust sampler significantly improved image clarity and semantic alignment with prompts.	\N
774	Generative AI Engineer (GenAI)	Python	System Design	Give an example of optimizing a model for performance or efficiency.	hard	{Python,"System Design",Coding}	For a real-time conversational AI system, I optimized a large language model by implementing quantization (int8) and knowledge distillation. This reduced the model's memory footprint by 70% and inference latency by 45%, enabling deployment on edge devices while maintaining ~98% of the original performance, crucial for interactive user experiences.	\N
775	Generative AI Engineer (GenAI)	Python	System Design	Describe a time when you had to debug a complex AI pipeline.	hard	{Python,"System Design",Coding}	I debugged an end-to-end GenAI pipeline for personalized content generation where outputs were inconsistent. The issue was traced to a subtle data skew introduced during feature engineering, propagating errors downstream into the fine-tuning process. By implementing robust data validation checks and integrating clear logging at each stage, I pinpointed the faulty transformation and corrected it, ensuring data integrity across the pipeline.	import logging\nlogging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')\n# Example of a data validation step\ndef validate_data(data_batch):\n    if data_batch.isnull().any().any():\n        logging.error('Null values detected in data batch.')\n        raise ValueError('Data validation failed: Null values.')\n    logging.info('Data batch validated successfully.')
776	Generative AI Engineer (GenAI)	Python	System Design	Tell me about a situation where you had limited data but had to build a model. How did you manage?	hard	{Python,"System Design",Coding,Fundamentals}	With limited proprietary data for a niche text generation task, I leveraged transfer learning by fine-tuning a pre-trained large language model (LLM) on our small dataset. Additionally, I employed advanced data augmentation techniques and generated synthetic data using a different, simpler generative model, effectively expanding our training set and achieving viable performance.	\N
777	Generative AI Engineer (GenAI)	Python	System Design	Give an example of when you had to innovate to improve a model’s output quality.	hard	{Python,"System Design",Coding}	Our creative text generation model struggled with generating diverse outputs, often repeating clichés. I innovated by integrating a diverse beam search strategy and a custom penalty for repetitive n-grams into the decoding process. This encouraged exploration in the latent space and significantly increased the originality and richness of the generated prose.	\N
778	Generative AI Engineer (GenAI)	Python	System Design	Tell me about a time you applied a novel architecture to a generative AI problem.	hard	{Python,"System Design",Coding,Fundamentals}	For a project requiring highly realistic, controllable image generation from sparse text descriptions, I proposed and implemented a conditional diffusion model over a traditional GAN. This novel architecture offered superior quality and finer control over output attributes through conditioning vectors, leading to a marked improvement in meeting subjective realism and controllability benchmarks.	\N
779	Generative AI Engineer (GenAI)	Python	System Design	Describe a project where you had to balance model accuracy vs. computational cost.	hard	{Python,"System Design",Coding}	When deploying a summarization model for a news platform, achieving 90% ROUGE-L score with a large Transformer model incurred high inference costs. We iteratively explored smaller, distilled models, finding that a distilled version achieved 88% ROUGE-L, while reducing computational cost by 5x. This 2% drop in accuracy was an acceptable trade-off for the significant cost savings and faster inference in production.	\N
780	Generative AI Engineer (GenAI)	Python	Fundamentals	Describe a time you collaborated with data scientists, engineers, or designers on a GenAI project.	medium	{Python,Fundamentals}	On a GenAI project for marketing content generation, I closely collaborated with designers to understand visual aesthetics and brand guidelines for output, and with engineers to optimize model serving and API integration. This cross-functional alignment ensured the model's outputs were not only high-quality but also production-ready and aesthetically pleasing to target users.	\N
781	Generative AI Engineer (GenAI)	Python	Fundamentals	Give an example of explaining a complex model to a non-technical stakeholder.	medium	{Python,Fundamentals}	I once explained our diffusion model for product design to a marketing VP by comparing it to an artist refining a blurry sketch into a detailed painting, step-by-step. I focused on the business impact – faster iteration, diverse design options – rather than technical jargon, using visual analogies and outcome-oriented language.	\N
782	Generative AI Engineer (GenAI)	Python	Fundamentals	Tell me about a time you received conflicting feedback from your team. How did you handle it?	medium	{Python,Fundamentals}	When optimizing a GenAI model, one team member prioritized output diversity, while another emphasized factual accuracy. I facilitated a discussion to define common evaluation metrics and ran targeted experiments to quantify the trade-offs. The data-driven comparison helped us reach a consensus on a balanced approach that met both objectives adequately.	\N
783	Generative AI Engineer (GenAI)	Python	Fundamentals	Describe a situation where teamwork helped improve your model or workflow.	medium	{Python,Fundamentals}	Developing a novel text summarization model, a colleague suggested incorporating a reinforcement learning fine-tuning step based on human feedback. By combining my expertise in core generative architectures with their RL knowledge, we successfully integrated the human-in-the-loop feedback, leading to significantly more coherent and relevant summaries than my initial approach.	\N
784	Generative AI Engineer (GenAI)	Python	System Design	Have you ever worked in a cross-functional team to integrate AI into a product? What challenges did you face?	hard	{Python,"System Design",API,Fundamentals}	I integrated a GenAI model for personalized content recommendations into a mobile app. The main challenge was aligning model output formats with frontend display requirements and backend database schemas. This involved extensive API design discussions and iterating on payload structures to ensure seamless data flow and user experience, ultimately deploying a robust, scalable system.	\N
785	Generative AI Engineer (GenAI)	Python	Fundamentals	How do you stay updated with fast-changing GenAI technologies?	easy	{Python,Fundamentals}	I regularly follow leading AI research conferences (NeurIPS, ICML, ICLR), subscribe to key academic pre-print archives (arXiv ML), and engage with open-source communities on platforms like Hugging Face. Hands-on experimentation with new models and frameworks is also crucial for practical understanding and skill development.	\N
786	Generative AI Engineer (GenAI)	Python	Fundamentals	Tell me about a time you had to quickly learn a new AI framework or tool.	medium	{Python,Coding,Fundamentals}	When our team decided to transition from TensorFlow to PyTorch for better research flexibility, I dedicated a weekend to PyTorch's official tutorials and reimplemented a small generative model. This hands-on approach, combined with studying existing PyTorch codebases, allowed me to quickly become proficient and contribute effectively within weeks.	\N
787	Generative AI Engineer (GenAI)	Python	System Design	Describe a situation where you adapted your approach due to new research findings.	medium	{Python,"System Design",Fundamentals}	While developing a text-to-code model, I initially focused on encoder-decoder architectures. However, new research on instruction-tuned large language models showed superior few-shot capabilities. I adapted our strategy by fine-tuning an existing instruction-tuned LLM, significantly accelerating development and improving code generation quality with less data.	\N
788	Generative AI Engineer (GenAI)	Python	System Design	Give an example of when you had to pivot a project because your original approach failed.	hard	{Python,"System Design",Fundamentals}	My initial approach for generating realistic human faces using a specific GAN architecture consistently produced artifacts. After extensive troubleshooting without success, I recognized the architectural limitation. I then pivoted to a latent diffusion model, which, despite requiring more computational resources initially, ultimately delivered the photorealistic quality required, demonstrating adaptability and effective problem re-framing.	\N
789	Generative AI Engineer (GenAI)	Python	Fundamentals	Tell me about a time you explored a new generative model out of curiosity or initiative.	medium	{Python,Coding,Fundamentals}	Out of curiosity, I explored StyleGAN2 for high-fidelity image generation, even though it wasn't directly required for a project. I built a small demo to generate novel fashion designs, which later sparked internal discussions and led to a new prototype project for synthetic dataset generation, showcasing proactive exploration leading to tangible value.	\N
790	Generative AI Engineer (GenAI)	Python	Fundamentals	Describe an instance where you considered ethical implications of your AI work.	medium	{Python,Fundamentals}	While developing a GenAI model for synthetic data generation, I recognized the potential for misuse in creating deepfakes or misinformation. I proactively implemented guardrails by restricting the model's training data to non-identifiable subjects and integrating output filtering, ensuring responsible development and mitigating potential negative societal impacts.	\N
791	Generative AI Engineer (GenAI)	Python	System Design	How have you addressed bias or fairness issues in your models?	hard	{Python,"System Design",Fundamentals}	In a GenAI model for job description generation, I identified gender bias in output (e.g., 'he' for engineer roles). I addressed this by first analyzing the training data for bias using statistical methods. Then, I employed re-weighting techniques during training and incorporated debiasing layers, leading to more inclusive and fair output generation, validated by specific fairness metrics.	\N
792	Generative AI Engineer (GenAI)	Python	System Design	Give an example of handling inappropriate or unsafe model outputs.	hard	{Python,"System Design",Coding}	For a public-facing text generation API, I developed a multi-layered safety mechanism. This included pre-processing input prompts to filter harmful keywords, implementing a classification model for real-time output moderation, and leveraging a post-processing filter to mask or redact potentially unsafe content, ensuring a safe user experience.	\N
793	Generative AI Engineer (GenAI)	Python	System Design	Tell me about a time you had to implement guardrails or monitoring for a generative AI system.	hard	{Python,"System Design",API,Coding}	I implemented guardrails for a deployed GenAI content creation system to prevent outputting copyrighted material. This involved integrating a real-time similarity search against a database of known copyrighted content and a content filter based on a fine-tuned classification model, coupled with anomaly detection for unexpected usage patterns. Monitoring dashboards provided continuous oversight, allowing us to quickly detect and address any deviations.	\N
794	Generative AI Engineer (GenAI)	Python	System Design	How would you ensure responsible AI usage in a deployed product?	hard	{Python,"System Design",Fundamentals}	Ensuring responsible AI usage involves transparent communication about model capabilities and limitations to users, implementing continuous monitoring for bias and unintended outputs, and establishing clear ethical guidelines for development and deployment. Crucially, a robust feedback mechanism for users to report issues and a human-in-the-loop review process for critical applications are essential.	\N
795	Generative AI Engineer (GenAI)	Python	Fundamentals	Tell me about a project that failed. What did you learn from it?	hard	{Python,Fundamentals}	A project to generate personalized music failed because the chosen architecture struggled with long-range musical coherence. I learned the critical importance of selecting model architectures suited to the intrinsic properties of the data, and the need for earlier, more comprehensive qualitative evaluation of generative outputs beyond just metrics, to avoid investing too heavily in a flawed direction.	\N
796	Generative AI Engineer (GenAI)	Python	System Design	Describe a time when your model gave unexpected results. How did you troubleshoot?	hard	{Python,"System Design",Coding}	A generative model for design elements started producing repetitive, uncreative outputs after a fine-tuning run. I started troubleshooting by inspecting the training logs for convergence issues and learning rate anomalies. The root cause was data leakage in the fine-tuning dataset, which I rectified by implementing stricter data isolation and re-validating the data pipeline before retraining.	\N
797	Generative AI Engineer (GenAI)	Python	System Design	Give an example of overcoming a technical obstacle in a GenAI project.	hard	{Python,"System Design",Coding}	I faced a significant challenge with VRAM limitations when training large diffusion models for 4K image generation. I overcame this by implementing gradient checkpointing and mixed-precision training techniques, effectively reducing memory consumption by over 50%. This allowed us to train the model on available hardware without sacrificing resolution, directly impacting project feasibility.	\N
798	Generative AI Engineer (GenAI)	Python	Fundamentals	Have you ever had to abandon a model or approach? How did you handle it?	medium	{Python,Fundamentals}	Yes, I abandoned a sophisticated variational autoencoder (VAE) for text generation when its outputs consistently lacked diversity despite extensive hyperparameter tuning. I presented the quantitative and qualitative evidence to the team, explaining the limitations, and proposed pivoting to a Transformer-based model which showed better initial results, ensuring we didn't waste resources on a dead end.	\N
799	Generative AI Engineer (GenAI)	Python	Fundamentals	Tell me about a situation where you had to convince stakeholders to try a different AI solution.	hard	{Python,Fundamentals}	Stakeholders initially favored a rule-based system for content generation due to its perceived control. I demonstrated through prototypes and a clear cost-benefit analysis that a fine-tuned GenAI model could achieve superior content quality, greater scalability, and lower long-term maintenance costs, ultimately convincing them to adopt the AI-driven solution.	\N
800	Generative AI Engineer (GenAI)	Python	System Design	Tell me about a project where you applied generative AI in a creative or unique way.	hard	{Python,"System Design",Coding}	I developed a system that uses GenAI to dynamically generate procedural 3D assets for game environments based on high-level textual descriptions. Instead of pre-rendering, a fine-tuned LLM interprets commands and outputs parameters for a geometry generation framework, allowing game designers to rapidly prototype unique environments with minimal manual effort.	\N
801	Generative AI Engineer (GenAI)	Python	System Design	Have you suggested a new model architecture or workflow to improve results? What happened?	hard	{Python,"System Design",Coding}	Yes, I suggested a cascaded diffusion model architecture for higher resolution image generation, where a base model generates low-res images and a super-resolution model refines them. After prototyping, this approach significantly outperformed our single-stage model in terms of visual fidelity and allowed for more granular control, leading to its adoption in the main project.	\N
802	Generative AI Engineer (GenAI)	Python	System Design	Describe a time when you explored an unconventional solution to a problem.	hard	{Python,"System Design",Coding}	Facing limitations in controlling specific attributes in image generation, I explored using disentangled representation learning in a VAE, where each latent dimension corresponds to a controllable feature. This unconventional approach, while challenging to train, provided precise control over elements like color, texture, and shape, which was not easily achievable with standard GANs at the time.	\N
803	Generative AI Engineer (GenAI)	Python	System Design	Give an example of a project where your ideas significantly improved the outcome.	hard	{Python,"System Design",Coding}	In a project to generate marketing copy, I introduced the concept of 'persona-driven' prompting, where we explicitly define audience personas for the LLM. This idea led to a 30% increase in conversion rates for the generated copy, as it became much more targeted and resonant with specific customer segments, a measurable and significant improvement.	\N
804	Generative AI Engineer (GenAI)	Python	Fundamentals	Have you contributed to open-source AI tools or research?	medium	{Python,Fundamentals,Coding}	Yes, I've contributed bug fixes and documentation improvements to the Hugging Face `transformers` library, specifically for a new diffusion model integration. I also maintain a personal GitHub repository with implementations of novel generative models from recent papers, which has garnered some stars and forks from the community.	\N
805	Generative AI Engineer (GenAI)	Python	Fundamentals	Tell me about a time you managed multiple AI projects simultaneously. How did you prioritize?	medium	{Python,Fundamentals}	I once managed concurrent projects: optimizing an existing GenAI model and prototyping a new multimodal one. I prioritized using a combination of impact-effort matrix and stakeholder deadlines. I block-scheduled focused time for each, delegated sub-tasks where possible, and ensured regular communication to manage expectations and report progress on both fronts effectively.	\N
806	Generative AI Engineer (GenAI)	Python	System Design	Describe a situation where deadlines forced you to optimize a model quickly.	hard	{Python,"System Design",Coding}	With a tight deadline for a product launch, I needed to drastically reduce the inference time of our text-to-image model. I aggressively applied techniques like model pruning, weight quantization (FP16), and optimizing batch inference on GPUs, achieving a 4x speedup in just three days while maintaining acceptable output quality, enabling on-time deployment.	\N
807	Generative AI Engineer (GenAI)	Python	System Design	Give an example of when you had to plan experiments efficiently to save time and resources.	medium	{Python,"System Design",Coding}	For a large-scale generative model fine-tuning project, I designed experiments using a factorial design approach instead of sequential testing. This allowed us to evaluate the impact of multiple hyperparameter combinations and architectural variations simultaneously, significantly reducing the number of training runs and GPU hours needed to find the optimal configuration.	\N
808	Generative AI Engineer (GenAI)	Python	System Design	Tell me about a project where you had to scale AI models for production under constraints.	hard	{Python,"System Design",API,Coding}	I scaled a text-generation API with a limited budget by implementing a serverless architecture for inference. This involved containerizing the model (Docker), deploying it on a cloud function platform, and optimizing cold start times through pre-warmed instances and efficient model loading. This allowed us to handle fluctuating traffic with minimal cost, scaling dynamically as needed.	\N
809	Generative AI Engineer (GenAI)	Python	System Design	Describe a situation where you had to choose between multiple AI approaches. How did you decide?	hard	{Python,"System Design",Fundamentals}	For a creative writing assistant, I evaluated between a large Transformer-based language model and a conditional GAN for text generation. I decided based on a comprehensive analysis of required output quality, inference latency, and dataset availability. While the GAN offered novelty, the Transformer's superior coherence and ease of fine-tuning for our data led to its selection, prioritizing practical impact over experimental novelty.	\N
810	Generative AI Engineer (GenAI)	Python	System Design	Tell me about a time you made a technical decision that didn’t turn out as expected.	hard	{Python,"System Design",Fundamentals}	I once decided to use a custom attention mechanism in a generative model, expecting performance gains. However, it introduced numerical instability and training divergence. I quickly identified the issue through gradient checks and reverted to a standard attention mechanism, learning the importance of validating novel components thoroughly before deep integration, even if theoretically sound.	\N
811	Generative AI Engineer (GenAI)	Python	System Design	Give an example of a decision where trade-offs between model complexity and performance were involved.	hard	{Python,"System Design",Coding}	For an embedded GenAI application on mobile, a highly complex model offered superior image generation quality but caused unacceptable battery drain. We opted for a smaller, quantized model, trading a minor reduction in visual fidelity for drastically improved energy efficiency and latency. This decision was critical for user experience and product viability on resource-constrained devices.	\N
812	Generative AI Engineer (GenAI)	Python	Behavioral	Can you walk me through a time when a generative model you worked on didn’t behave as expected? How did you approach fixing it?	hard	{Python,Fundamentals,Coding}	I systematically debugged a VAE producing blurry images by inspecting the loss function components and latent space distribution. I found an imbalance, adjusted the KL divergence weight (beta), and iterated on hyperparameters, which significantly improved reconstruction clarity.	
813	Generative AI Engineer (GenAI)	Python	Behavioral	Imagine you only have a small dataset, but you need to fine-tune a large language model. What would you do?	hard	{Python,Fundamentals,Coding}	I'd leverage Parameter-Efficient Fine-Tuning (PEFT) methods like LoRA to train only a small fraction of parameters, combined with strategic data augmentation or synthetic data generation from the base model itself, to maximize the use of the limited dataset while preventing overfitting.	
814	Generative AI Engineer (GenAI)	Python	Behavioral	Tell me about a time you had to experiment with multiple architectures to get the output you wanted.	hard	{Python,Fundamentals,Coding}	For a text-to-image task, I started with a basic GAN, then moved to a Conditional GAN for better control, and finally adopted a Diffusion Model. Each architectural shift addressed specific limitations like mode collapse or lack of semantic control, progressively yielding higher quality and controllable outputs.	
815	Generative AI Engineer (GenAI)	Python	Behavioral	Have you ever faced a situation where your model’s outputs were inconsistent? How did you debug it?	medium	{Python,Fundamentals}	I encountered inconsistent outputs with a Text Generation model. I debugged by ensuring fixed random seeds, standardizing data preprocessing, and checking for GPU non-determinism, ultimately tracing it to subtle differences in tokenization during inference vs. training.	
816	Generative AI Engineer (GenAI)	Python	Behavioral	Describe a project where you had to make trade-offs between model accuracy and computational efficiency.	hard	{Python,Fundamentals,"System Design"}	In an edge device deployment, I had to balance a large vision transformer's accuracy with latency constraints. I explored quantization and knowledge distillation, opting for a distilled, smaller model that maintained 90% of the original accuracy but reduced inference time by 75%, making it viable for real-time applications.	
817	Generative AI Engineer (GenAI)	Python	Behavioral	Generative AI is evolving fast. How do you make sure you stay current with new models and techniques?	medium	{Python,Fundamentals}	I regularly follow arXiv preprints and key AI blogs (e.g., Hugging Face, Google AI Research), participate in online courses, and experiment hands-on with new open-source models. I also engage in AI communities to discuss recent breakthroughs and best practices.	
818	Generative AI Engineer (GenAI)	Python	Behavioral	Tell me about a time you learned a new AI framework or tool on your own for a project.	medium	{Python,Fundamentals,Coding}	For a project needing advanced experiment tracking, I proactively learned MLflow. I used its documentation and tutorials to integrate it into our existing PyTorch workflow, which streamlined our hyperparameter tuning and model versioning significantly.	
819	Generative AI Engineer (GenAI)	Python	Behavioral	Have you ever tried an AI model for a side project or hackathon? What was your approach?	medium	{Python,Fundamentals,Coding}	During a hackathon, I used a pre-trained Stable Diffusion model for an 'AI-powered comic strip generator.' My approach focused on rapid prototyping with prompt engineering and fine-tuning with LoRA to quickly achieve creative, consistent visual styles within the short timeframe.	
820	Generative AI Engineer (GenAI)	Python	Behavioral	Can you share an example where learning something new directly helped improve your AI work?	medium	{Python,Fundamentals}	Learning about Reinforcement Learning from Human Feedback (RLHF) directly improved a chatbot project. By integrating human preferences into the fine-tuning process, the model's responses became significantly more aligned with user intent and ethical guidelines, surpassing purely unsupervised methods.	
821	Generative AI Engineer (GenAI)	Python	Behavioral	Have you ever explored research papers or preprints to implement a technique that wasn’t in tutorials?	hard	{Python,Fundamentals,Coding}	Yes, I implemented a novel attention mechanism from a recent arXiv paper to improve our text summarization model. It required deep diving into the mathematical formulations and translating them into PyTorch code, ultimately leading to a 15% boost in ROUGE scores compared to standard attention.	
822	Generative AI Engineer (GenAI)	Python	Behavioral	Tell me about a time you had to explain complex AI outputs to a non-technical teammate or manager.	medium	{Python}	I once explained why a content generation model produced unexpected outputs by using simple analogies, like a 'chef missing a key ingredient.' I then showed visualizations of topic distributions and keyword relevance to illustrate the model's focus, helping them understand its 'reasoning' without deep technical jargon.	
823	Generative AI Engineer (GenAI)	Python	Behavioral	Describe a situation where you disagreed with a teammate about a model or approach. How did you resolve it?	medium	{Python}	A teammate favored a complex model while I argued for a simpler baseline. We agreed to A/B test both approaches on a small dataset, comparing not just accuracy but also inference cost and interpretability. The data showed my simpler model performed comparably with lower overhead, leading to a consensus.	
824	Generative AI Engineer (GenAI)	Python	Behavioral	Have you worked on a project where multiple people were fine-tuning the same model? How did you coordinate?	medium	{Python}	On a team project, we coordinated fine-tuning a large language model by using shared Git branches for individual experiments, a centralized Weights & Biases dashboard for logging results, and daily stand-ups to discuss findings and avoid duplicate efforts.	
825	Generative AI Engineer (GenAI)	Python	Behavioral	Can you give an example of helping a teammate understand or debug your AI workflow?	medium	{Python,Coding}	I helped a teammate debug my text classification workflow by walking them through my modularized codebase and comprehensive README. We jointly stepped through the data preprocessing, model training, and evaluation scripts, which clarified the data flow and identified a critical bug in their local environment setup.	
826	Generative AI Engineer (GenAI)	Python	Behavioral	Have you ever worked with designers or product managers to integrate a generative model into an application?	medium	{Python,"System Design",API}	Yes, I collaborated with UX designers to integrate a text-to-image model into a creative app. I translated model capabilities into user-friendly prompts, established API endpoints for seamless integration, and iteratively refined the model's output based on their feedback to ensure a delightful user experience.	
827	Generative AI Engineer (GenAI)	Python	Behavioral	Generative AI can produce unsafe content. How would you handle or prevent this in your models?	hard	{Python,Fundamentals}	I'd implement multi-layered safety measures: fine-tuning with curated safety datasets, integrating content moderation APIs (e.g., Google's Perspective API), applying robust input/output filtering based on sensitive keywords, and employing Reinforcement Learning from Human Feedback (RLHF) to align outputs with ethical guidelines.	
828	Generative AI Engineer (GenAI)	Python	Behavioral	Tell me about a time you identified bias in a dataset or model. What did you do?	hard	{Python,Fundamentals}	I identified gender bias in a job description generator using fairness metrics and qualitative analysis. To mitigate, I rebalanced the training data for gender-neutral phrasing, applied debiasing techniques like re-weighting, and retrained the model, significantly reducing gender-specific language in outputs.	
829	Generative AI Engineer (GenAI)	Python	Behavioral	Have you ever had to make a decision to limit a model’s capabilities for ethical reasons?	hard	{Python,Fundamentals}	Yes, I limited a text generation model's ability to create highly realistic deepfakes of public figures, even though the capability existed. The potential for misuse outweighed the novelty, so I restricted its fine-tuning to non-public datasets and implemented strict content filters to prevent malicious applications.	
830	Generative AI Engineer (GenAI)	Python	Behavioral	Can you describe a project where you tried a novel idea with generative AI that hadn’t been done before?	hard	{Python,Fundamentals,Coding}	I developed a novel system for generating synthetic training data for rare medical images using a conditional diffusion model, overcoming privacy constraints and scarcity. By conditioning on disease markers, it produced highly realistic and diverse synthetic scans, drastically improving downstream diagnostic model performance.	
831	Generative AI Engineer (GenAI)	Python	Behavioral	Tell me about a time you suggested an improvement to a workflow or model architecture, and what happened next.	medium	{Python,Fundamentals,"System Design"}	I suggested migrating our model serving from a monolithic flask app to a FastAPI microservice with a dedicated GPU orchestrator. This improved API latency by 40%, streamlined deployments, and allowed for independent scaling, which was adopted and successfully implemented by the MLOps team.	
\.


--
-- Data for Name: job_skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_skill (job_id, skill_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
2	1
2	2
2	3
2	4
2	5
3	1
3	2
3	3
3	4
3	5
4	1
4	2
4	3
4	4
4	5
5	6
5	7
5	8
5	9
6	6
6	7
6	8
6	9
7	1
7	2
7	3
7	4
7	5
8	6
8	8
8	9
9	10
9	11
9	12
9	13
10	8
10	13
10	14
10	2
10	15
11	16
11	15
11	17
11	14
12	15
12	8
12	3
12	16
12	12
13	18
13	4
13	13
13	6
13	1
13	14
14	18
14	11
14	7
14	2
14	10
14	15
15	19
15	14
15	5
15	1
16	9
16	13
16	18
16	19
17	20
17	14
17	15
17	11
18	17
18	6
18	1
18	4
19	15
19	21
19	20
19	16
19	8
19	9
20	20
20	2
20	5
20	7
20	12
21	1
21	12
21	8
21	22
21	7
21	19
22	11
22	20
22	1
22	9
23	22
23	12
23	11
23	7
23	9
23	19
24	20
24	16
24	4
24	22
24	14
24	7
25	14
25	11
25	7
25	5
25	18
26	7
26	9
26	13
26	17
26	15
26	22
27	21
27	14
27	23
27	22
28	7
28	4
28	6
28	9
29	9
29	12
29	2
30	22
30	6
30	1
31	12
31	9
31	14
31	4
31	1
32	11
32	22
32	18
32	3
33	21
33	10
33	14
34	5
34	18
34	15
34	6
35	5
35	16
35	17
35	10
35	13
35	11
36	13
36	17
36	8
36	4
36	7
37	21
37	4
37	5
37	11
38	18
38	20
38	23
38	6
38	2
38	16
39	9
39	17
39	16
39	10
39	15
40	6
40	19
40	12
40	20
40	11
41	15
41	4
41	2
41	18
42	20
42	5
42	16
42	22
42	2
42	10
43	21
43	13
43	11
43	5
44	9
44	7
44	3
44	10
45	20
45	3
45	15
45	14
45	6
46	9
46	23
46	8
46	21
46	19
47	6
47	1
47	18
47	22
47	4
47	8
48	8
48	12
48	21
48	11
49	14
49	12
49	6
49	1
49	5
50	18
50	19
50	1
51	19
51	5
51	7
51	17
51	20
52	24
52	9
52	17
52	3
52	23
53	17
53	8
53	15
53	1
53	14
54	19
54	4
54	2
55	6
55	5
55	17
56	1
56	20
56	22
57	2
57	13
57	11
58	22
58	17
58	12
58	15
58	2
58	7
59	11
59	2
59	19
59	24
60	15
60	8
60	3
61	19
61	13
61	7
61	20
62	5
62	3
62	7
63	8
63	5
63	17
63	15
63	6
64	7
64	1
64	15
64	12
64	18
64	3
65	11
65	23
65	4
65	6
66	12
66	18
66	1
66	2
66	14
67	14
67	13
67	2
68	16
68	24
68	1
68	21
69	8
69	7
69	19
70	10
70	12
70	14
70	21
70	9
71	16
71	2
71	8
71	21
72	17
72	22
72	19
73	16
73	22
73	3
73	12
73	1
73	24
74	11
74	5
74	24
74	17
74	21
74	14
75	21
75	23
75	24
75	4
75	6
75	9
76	11
76	17
76	1
76	24
76	10
77	1
77	15
77	17
78	2
78	9
78	18
78	22
78	5
79	16
79	24
79	9
80	5
80	7
80	12
80	2
80	8
80	18
81	9
81	22
81	3
81	24
81	12
82	13
82	16
82	2
82	18
83	8
83	22
83	17
83	4
83	10
83	6
84	21
84	13
84	12
85	15
85	20
85	8
85	6
85	1
85	12
86	8
86	21
86	11
86	24
86	17
86	14
87	3
87	15
87	13
88	4
88	11
88	12
88	2
89	8
89	11
89	15
89	23
89	13
90	3
90	1
90	7
90	16
90	15
91	12
91	3
91	9
92	17
92	14
92	23
93	16
93	18
93	15
93	22
93	19
93	17
94	5
94	2
94	11
94	9
95	19
95	18
95	3
95	12
95	17
95	11
96	22
96	20
96	15
97	9
97	14
97	10
97	13
97	5
97	4
98	11
98	19
98	14
98	21
99	14
99	13
99	12
100	18
100	22
100	13
100	11
100	24
100	5
101	6
101	4
101	18
101	12
101	14
102	20
102	24
102	2
102	8
103	2
103	19
103	18
103	22
103	3
104	15
104	2
104	11
105	24
105	21
105	7
106	15
106	7
106	20
107	21
107	17
107	15
107	20
107	4
108	1
108	4
108	6
108	22
109	24
109	10
109	4
109	11
109	20
109	9
110	9
110	4
110	5
111	14
111	15
111	13
111	19
112	19
112	14
112	23
112	17
113	7
113	1
113	2
113	13
113	4
113	17
114	11
114	21
114	1
114	19
114	24
115	3
115	17
115	6
115	7
116	1
116	9
116	7
117	8
117	18
117	7
117	14
117	5
117	17
118	14
118	6
118	24
119	21
119	11
119	10
119	4
119	3
119	5
120	5
120	20
120	19
120	3
121	20
121	12
121	15
121	3
121	9
121	10
122	22
122	12
122	20
122	8
122	4
122	7
123	12
123	16
123	15
123	5
123	21
124	1
124	16
124	5
124	11
124	6
125	8
125	15
125	24
126	12
126	17
126	8
126	13
126	7
127	24
127	14
127	22
127	20
127	11
128	2
128	20
128	21
128	22
128	10
129	18
129	15
129	24
129	14
129	16
129	5
130	18
130	15
130	9
131	3
131	14
131	1
131	9
132	11
132	22
132	13
133	2
133	9
133	3
133	8
133	19
133	10
134	21
134	14
134	24
135	22
135	20
135	16
135	1
136	4
136	6
136	17
136	2
136	12
136	21
137	18
137	9
137	2
138	7
138	18
138	22
138	8
138	20
139	16
139	2
139	24
139	20
139	1
140	8
140	17
140	9
140	2
140	19
141	24
141	16
141	11
141	9
142	18
142	21
142	20
143	7
143	23
143	9
143	5
143	20
143	14
144	6
144	10
144	21
144	20
145	21
145	22
145	1
146	12
146	5
146	18
146	17
147	2
147	15
147	23
147	24
147	8
147	13
148	21
148	5
148	2
148	11
148	16
149	10
149	15
149	24
149	5
149	23
149	2
150	13
150	20
150	23
151	20
151	1
151	13
151	8
151	19
152	23
152	4
152	13
152	1
152	8
152	21
153	19
153	20
153	23
154	10
154	3
154	4
154	14
154	17
154	7
155	9
155	6
155	21
155	8
155	5
155	22
156	16
156	7
156	8
156	4
156	21
156	13
157	16
157	21
157	6
158	12
158	17
158	23
158	5
158	22
158	15
159	3
159	15
159	9
159	11
159	18
160	1
160	11
160	12
161	2
161	18
161	23
161	14
162	7
162	20
162	6
162	22
162	13
162	10
163	9
163	14
163	2
164	16
164	9
164	20
164	3
165	15
165	21
165	12
165	20
166	13
166	19
166	21
166	17
166	10
167	5
167	21
167	19
167	20
167	2
168	3
168	19
168	4
168	15
168	12
168	16
169	23
169	12
169	5
170	6
170	13
170	16
171	11
171	10
171	8
172	1
172	12
172	4
173	12
173	5
173	23
174	7
174	5
174	18
175	5
175	10
175	6
175	11
176	3
176	13
176	19
176	10
176	20
176	8
177	11
177	12
177	13
177	9
178	24
178	18
178	21
178	8
178	14
178	5
179	11
179	6
179	23
179	14
179	15
180	17
180	21
180	14
180	6
181	22
181	12
181	10
181	6
181	14
181	23
182	18
182	8
182	5
182	3
183	2
183	22
183	23
183	11
184	17
184	13
184	6
184	5
184	12
185	4
185	14
185	11
185	16
186	17
186	18
186	14
186	11
186	3
187	18
187	20
187	2
187	21
188	6
188	16
188	15
189	17
189	6
189	4
189	3
190	16
190	2
190	15
190	18
191	21
191	5
191	7
191	9
191	2
192	22
192	7
192	5
192	19
192	13
192	8
193	13
193	5
193	22
193	8
193	23
193	14
194	6
194	18
194	14
194	11
194	1
194	15
195	15
195	20
195	21
195	10
195	24
195	19
196	23
196	16
196	19
197	13
197	17
197	15
197	1
198	16
198	12
198	22
199	18
199	16
199	17
199	7
199	15
200	18
200	23
200	2
200	15
201	24
201	12
201	9
202	6
202	17
202	21
202	4
203	2
203	24
203	3
203	15
203	14
203	16
204	16
204	24
204	9
204	21
204	17
205	23
205	7
205	15
205	19
205	17
205	10
206	16
206	11
206	12
206	24
207	4
207	17
207	1
207	6
207	14
207	5
208	23
208	11
208	9
208	2
208	13
209	10
209	18
209	23
210	22
210	20
210	11
211	23
211	13
211	18
211	10
211	19
212	22
212	3
212	6
212	5
213	2
213	16
213	22
213	3
213	9
213	10
214	24
214	5
214	18
214	15
214	6
215	11
215	4
215	12
216	14
216	21
216	5
216	3
216	15
216	10
217	3
217	12
217	16
217	11
218	9
218	6
218	13
218	15
218	21
219	12
219	13
219	11
219	10
220	4
220	10
220	22
220	5
220	23
221	17
221	1
221	5
221	9
221	2
221	6
222	12
222	4
222	17
222	5
222	15
222	1
223	18
223	4
223	8
224	17
224	3
224	22
224	10
224	23
225	1
225	2
225	19
225	5
225	23
225	10
226	6
226	9
226	7
226	21
226	12
227	19
227	22
227	9
227	15
228	21
228	22
228	23
228	16
228	12
228	1
229	12
229	19
229	15
229	14
229	3
230	8
230	5
230	9
230	16
230	7
230	18
231	2
231	22
231	13
231	8
232	20
232	15
232	23
233	8
233	2
233	3
233	15
234	12
234	8
234	13
234	3
234	9
235	17
235	16
235	19
235	21
235	11
236	24
236	18
236	10
237	4
237	18
237	12
237	16
237	15
238	2
238	17
238	11
238	20
239	16
239	14
239	9
239	12
240	1
240	19
240	21
241	18
241	3
241	7
241	8
241	22
241	15
242	18
242	8
242	20
243	18
243	15
243	14
243	23
244	14
244	1
244	20
245	12
245	23
245	2
245	14
245	13
245	5
246	17
246	9
246	21
247	17
247	22
247	12
247	6
247	7
247	9
248	13
248	5
248	21
249	4
249	16
249	12
249	6
250	11
250	14
250	4
250	24
250	17
250	19
251	19
251	16
251	7
251	13
252	21
252	7
252	5
252	13
252	11
253	8
253	13
253	15
253	18
254	6
254	16
254	13
254	12
254	15
255	12
255	20
255	22
255	21
255	2
256	22
256	19
256	20
257	18
257	23
257	2
257	19
257	13
258	3
258	20
258	8
258	14
258	2
258	21
259	7
259	4
259	17
259	6
260	10
260	9
260	19
260	5
261	18
261	21
261	7
262	9
262	3
262	22
262	14
263	1
263	18
263	21
264	2
264	4
264	19
264	14
264	6
265	20
265	24
265	23
266	19
266	22
266	15
266	1
266	14
266	6
267	18
267	9
267	2
267	11
267	13
268	15
268	12
268	3
268	22
269	24
269	6
269	19
270	18
270	13
270	12
270	17
270	24
270	21
271	15
271	16
271	18
272	9
272	14
272	12
272	4
273	19
273	15
273	14
274	11
274	19
274	24
274	6
274	5
274	13
275	21
275	13
275	23
275	3
275	22
276	3
276	13
276	10
276	23
276	2
276	20
277	7
277	10
277	3
278	20
278	11
278	12
279	12
279	17
279	13
280	13
280	11
280	24
280	23
280	5
281	14
281	15
281	2
281	19
282	23
282	2
282	12
282	3
282	4
283	10
283	19
283	5
284	16
284	20
284	14
284	3
284	23
285	6
285	1
285	8
286	18
286	7
286	20
286	17
287	7
287	12
287	20
287	11
287	22
288	16
288	18
288	19
288	1
288	5
289	13
289	21
289	8
289	15
289	20
290	12
290	7
290	19
291	24
291	2
291	3
291	12
291	22
291	18
292	21
292	9
292	16
292	3
293	6
293	3
293	18
293	12
293	24
293	9
294	17
294	8
294	3
294	11
295	2
295	13
295	17
295	20
295	5
295	8
296	19
296	3
296	13
296	22
296	18
297	6
297	10
297	7
297	18
298	15
298	1
298	5
298	7
298	23
298	2
299	21
299	15
299	13
300	20
300	23
300	22
300	7
300	9
301	20
301	9
301	6
301	19
301	16
302	3
302	1
302	20
302	6
303	18
303	24
303	20
303	10
303	14
303	23
304	24
304	22
304	17
304	12
304	18
304	21
305	9
305	20
305	10
306	2
306	11
306	19
307	13
307	22
307	4
307	20
307	6
307	3
308	14
308	6
308	3
308	5
309	14
309	23
309	8
310	4
310	13
310	3
310	9
311	2
311	22
311	11
311	24
311	10
312	2
312	3
312	4
312	5
313	12
313	13
313	6
313	17
314	11
314	16
314	6
314	15
314	20
315	15
315	3
315	20
315	13
315	14
316	21
316	3
316	12
316	22
316	14
316	5
317	23
317	12
317	6
317	10
317	16
317	2
318	20
318	16
318	22
318	15
319	14
319	7
319	10
319	9
319	15
320	17
320	23
320	19
321	7
321	17
321	24
321	21
321	20
322	18
322	2
322	5
322	22
322	23
323	20
323	12
323	2
324	8
324	21
324	12
325	6
325	4
325	1
325	3
325	23
326	3
326	1
326	19
326	4
326	12
326	7
327	1
327	20
327	5
328	5
328	14
328	7
329	7
329	22
329	10
330	2
330	15
330	17
330	18
331	4
331	11
331	17
331	21
331	20
332	24
332	20
332	23
333	9
333	20
333	13
333	4
334	10
334	12
334	15
335	4
335	19
335	11
335	16
336	3
336	19
336	14
337	16
337	24
337	1
338	11
338	14
338	16
338	20
338	18
338	7
339	1
339	14
339	24
340	4
340	24
340	15
340	22
340	18
341	6
341	1
341	19
342	12
342	19
342	23
343	11
343	8
343	5
343	18
343	22
343	14
344	9
344	19
344	1
344	10
344	5
344	12
345	13
345	7
345	22
345	14
345	24
346	11
346	21
346	4
346	13
347	22
347	16
347	17
347	11
347	4
347	13
348	3
348	13
348	11
349	3
349	17
349	4
349	20
349	18
349	13
350	15
350	4
350	7
350	17
350	21
350	22
351	12
351	22
351	4
351	2
352	5
352	1
352	9
352	23
353	9
353	10
353	4
354	14
354	24
354	5
354	22
354	19
354	12
355	8
355	16
355	5
356	23
356	7
356	5
356	20
356	19
356	6
357	7
357	23
357	3
357	8
358	12
358	10
358	16
358	5
358	3
358	18
359	24
359	16
359	14
359	7
359	13
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, title, company, location, salary, type, description, posted) FROM stdin;
1	Senior Frontend Developer	Tech Innovations Inc.	San Francisco, CA (Remote)	$120K - $160K	Full-time	Join our team to build cutting-edge web applications using modern technologies.	\N
2	Senior Frontend Developer	Tech Innovations Inc.	San Francisco, CA (Remote)	$120K - $160K	Full-time	Join our team to build cutting-edge web applications using modern technologies.	\N
3	Senior Frontend Developer	Tech Innovations Inc.	San Francisco, CA (Remote)	$120K - $160K	Full-time	Join our team to build cutting-edge web applications using modern technologies.	\N
4	Senior Frontend Developer	Tech Innovations Inc.	San Francisco, CA (Remote)	$120K - $160K	Full-time	Join our team to build cutting-edge web applications using modern technologies.	\N
5	Backend Engineer	DataWorks Ltd.	New York, NY	$110K - $140K	Full-time	Work on scalable backend systems and APIs for our analytics platform.	\N
6	Backend devop Engineer	DataWorks Ltd.	New York, NY	$110K - $140K	Full-time	Work on scalable backend systems and APIs for our analytics platform.	\N
7	Senior Frontend Developer	Tech Innovations Inc.	San Francisco, CA (Remote)	$120K - $190K	Full-time	Join our team to build cutting-edge web applications using modern technologies.	\N
8	Backend Engineer	DataWorks Ltd.	New York, NY	$170K - $190K	Full-time	Work on scalable backend systems and APIs for our analytics platform.	\N
9	DevOps Engineer	CloudOps Solutions	Austin, TX	$145K - $175K	Full-time	Maintain CI/CD pipelines and cloud infrastructure for multiple projects.	\N
10	Full Stack Developer	Flipkart	Gurugram, Haryana	$141K - $168K	Full-time	This is a description for Full Stack Developer at Flipkart located in Gurugram, Haryana.	\N
11	Mobile App Developer	Mindtree	Bengaluru, Karnataka	$86K - $151K	Remote	This is a description for Mobile App Developer at Mindtree located in Bengaluru, Karnataka.	\N
12	Full Stack Developer	Flipkart	Pune, Maharashtra	$101K - $195K	Remote	This is a description for Full Stack Developer at Flipkart located in Pune, Maharashtra.	\N
13	Data Scientist	Cognizant India	Noida, Uttar Pradesh	$82K - $173K	Remote	This is a description for Data Scientist at Cognizant India located in Noida, Uttar Pradesh.	\N
14	Machine Learning Engineer	Flipkart	Mumbai, Maharashtra	$105K - $163K	Remote	This is a description for Machine Learning Engineer at Flipkart located in Mumbai, Maharashtra.	\N
15	iOS Developer	L&T Infotech	Hyderabad, Telangana	$124K - $172K	Remote	This is a description for iOS Developer at L&T Infotech located in Hyderabad, Telangana.	\N
16	Machine Learning Engineer	Google India	Gurugram, Haryana	$84K - $175K	Part-time	This is a description for Machine Learning Engineer at Google India located in Gurugram, Haryana.	\N
17	Software Engineer	Google India	Jaipur, Rajasthan	$116K - $177K	Remote	This is a description for Software Engineer at Google India located in Jaipur, Rajasthan.	\N
18	Mobile App Developer	Amazon India	Ahmedabad, Gujarat	$121K - $188K	Full-time	This is a description for Mobile App Developer at Amazon India located in Ahmedabad, Gujarat.	\N
19	QA Engineer	Infosys	Jaipur, Rajasthan	$91K - $193K	Full-time	This is a description for QA Engineer at Infosys located in Jaipur, Rajasthan.	\N
20	Senior Frontend Developer	Tech Mahindra	Jaipur, Rajasthan	$97K - $194K	Remote	This is a description for Senior Frontend Developer at Tech Mahindra located in Jaipur, Rajasthan.	\N
21	UI/UX Designer	Microsoft India	Pune, Maharashtra	$132K - $193K	Part-time	This is a description for UI/UX Designer at Microsoft India located in Pune, Maharashtra.	\N
22	Product Manager	Infosys	Bengaluru, Karnataka	$122K - $151K	Remote	This is a description for Product Manager at Infosys located in Bengaluru, Karnataka.	\N
23	UI/UX Designer	Mindtree	Hyderabad, Telangana	$142K - $195K	Remote	This is a description for UI/UX Designer at Mindtree located in Hyderabad, Telangana.	\N
24	Mobile App Developer	Capgemini India	Remote	$92K - $150K	Full-time	This is a description for Mobile App Developer at Capgemini India located in Remote.	\N
25	DevOps Engineer	Infosys	Noida, Uttar Pradesh	$115K - $197K	Remote	This is a description for DevOps Engineer at Infosys located in Noida, Uttar Pradesh.	\N
26	Software Engineer	Reliance Digital	Jaipur, Rajasthan	$142K - $176K	Part-time	This is a description for Software Engineer at Reliance Digital located in Jaipur, Rajasthan.	\N
27	Cloud Architect	IBM India	Kolkata, West Bengal	$94K - $199K	Remote	This is a description for Cloud Architect at IBM India located in Kolkata, West Bengal.	\N
28	Business Analyst	Amazon India	Kolkata, West Bengal	$88K - $200K	Full-time	This is a description for Business Analyst at Amazon India located in Kolkata, West Bengal.	\N
29	Software Engineer	Tata Consultancy Services	Chennai, Tamil Nadu	$94K - $161K	Remote	This is a description for Software Engineer at Tata Consultancy Services located in Chennai, Tamil Nadu.	\N
30	DevOps Engineer	Capgemini India	Hyderabad, Telangana	$137K - $166K	Full-time	This is a description for DevOps Engineer at Capgemini India located in Hyderabad, Telangana.	\N
31	Backend Engineer	Amazon India	Bengaluru, Karnataka	$94K - $189K	Part-time	This is a description for Backend Engineer at Amazon India located in Bengaluru, Karnataka.	\N
32	Backend Engineer	Tata Consultancy Services	Kolkata, West Bengal	$129K - $190K	Part-time	This is a description for Backend Engineer at Tata Consultancy Services located in Kolkata, West Bengal.	\N
33	Machine Learning Engineer	Infosys	Jaipur, Rajasthan	$117K - $198K	Remote	This is a description for Machine Learning Engineer at Infosys located in Jaipur, Rajasthan.	\N
34	Cloud Architect	Google India	Bengaluru, Karnataka	$104K - $152K	Remote	This is a description for Cloud Architect at Google India located in Bengaluru, Karnataka.	\N
35	Business Analyst	Wipro	Mumbai, Maharashtra	$87K - $155K	Remote	This is a description for Business Analyst at Wipro located in Mumbai, Maharashtra.	\N
36	Cybersecurity Analyst	Reliance Digital	Gurugram, Haryana	$91K - $176K	Full-time	This is a description for Cybersecurity Analyst at Reliance Digital located in Gurugram, Haryana.	\N
37	Mobile App Developer	IBM India	Ahmedabad, Gujarat	$134K - $175K	Remote	This is a description for Mobile App Developer at IBM India located in Ahmedabad, Gujarat.	\N
38	Software Engineer	Mindtree	Remote	$83K - $176K	Remote	This is a description for Software Engineer at Mindtree located in Remote.	\N
39	DevOps Engineer	Reliance Digital	Gurugram, Haryana	$103K - $184K	Part-time	This is a description for DevOps Engineer at Reliance Digital located in Gurugram, Haryana.	\N
40	Mobile App Developer	Wipro	Ahmedabad, Gujarat	$90K - $200K	Remote	This is a description for Mobile App Developer at Wipro located in Ahmedabad, Gujarat.	\N
41	Cybersecurity Analyst	Google India	Hyderabad, Telangana	$109K - $173K	Full-time	This is a description for Cybersecurity Analyst at Google India located in Hyderabad, Telangana.	\N
42	Software Engineer	Cognizant India	Gurugram, Haryana	$128K - $155K	Full-time	This is a description for Software Engineer at Cognizant India located in Gurugram, Haryana.	\N
43	DevOps Engineer	Reliance Digital	Mumbai, Maharashtra	$124K - $171K	Full-time	This is a description for DevOps Engineer at Reliance Digital located in Mumbai, Maharashtra.	\N
44	Machine Learning Engineer	Cognizant India	Jaipur, Rajasthan	$141K - $183K	Remote	This is a description for Machine Learning Engineer at Cognizant India located in Jaipur, Rajasthan.	\N
45	Business Analyst	Amazon India	Hyderabad, Telangana	$119K - $164K	Full-time	This is a description for Business Analyst at Amazon India located in Hyderabad, Telangana.	\N
46	Business Analyst	Amazon India	Ahmedabad, Gujarat	$105K - $166K	Remote	This is a description for Business Analyst at Amazon India located in Ahmedabad, Gujarat.	\N
47	Product Manager	Reliance Digital	Bengaluru, Karnataka	$90K - $176K	Full-time	This is a description for Product Manager at Reliance Digital located in Bengaluru, Karnataka.	\N
48	Software Engineer	L&T Infotech	Hyderabad, Telangana	$138K - $154K	Part-time	This is a description for Software Engineer at L&T Infotech located in Hyderabad, Telangana.	\N
49	DevOps Engineer	Tata Consultancy Services	Remote	$82K - $160K	Part-time	This is a description for DevOps Engineer at Tata Consultancy Services located in Remote.	\N
50	DevOps Engineer	Microsoft India	Kolkata, West Bengal	$109K - $180K	Full-time	This is a description for DevOps Engineer at Microsoft India located in Kolkata, West Bengal.	\N
51	Android Developer	Mindtree	Hyderabad, Telangana	$98K - $186K	Full-time	This is a description for Android Developer at Mindtree located in Hyderabad, Telangana.	\N
52	Android Developer	HCL Technologies	Kolkata, West Bengal	$105K - $183K	Full-time	This is a description for Android Developer at HCL Technologies located in Kolkata, West Bengal.	\N
53	Senior Frontend Developer	Wipro	Hyderabad, Telangana	$105K - $196K	Full-time	This is a description for Senior Frontend Developer at Wipro located in Hyderabad, Telangana.	\N
54	Data Scientist	Wipro	Kolkata, West Bengal	$99K - $154K	Part-time	This is a description for Data Scientist at Wipro located in Kolkata, West Bengal.	\N
55	UI/UX Designer	Infosys	Jaipur, Rajasthan	$110K - $199K	Full-time	This is a description for UI/UX Designer at Infosys located in Jaipur, Rajasthan.	\N
56	Senior Frontend Developer	Amazon India	Jaipur, Rajasthan	$111K - $187K	Part-time	This is a description for Senior Frontend Developer at Amazon India located in Jaipur, Rajasthan.	\N
57	UI/UX Designer	Infosys	Jaipur, Rajasthan	$146K - $162K	Remote	This is a description for UI/UX Designer at Infosys located in Jaipur, Rajasthan.	\N
58	Product Manager	L&T Infotech	Jaipur, Rajasthan	$84K - $184K	Full-time	This is a description for Product Manager at L&T Infotech located in Jaipur, Rajasthan.	\N
59	Mobile App Developer	Google India	Ahmedabad, Gujarat	$98K - $168K	Remote	This is a description for Mobile App Developer at Google India located in Ahmedabad, Gujarat.	\N
60	Backend Engineer	Amazon India	Bengaluru, Karnataka	$119K - $177K	Full-time	This is a description for Backend Engineer at Amazon India located in Bengaluru, Karnataka.	\N
61	iOS Developer	IBM India	Gurugram, Haryana	$133K - $186K	Part-time	This is a description for iOS Developer at IBM India located in Gurugram, Haryana.	\N
62	UI/UX Designer	Amazon India	Chennai, Tamil Nadu	$107K - $185K	Part-time	This is a description for UI/UX Designer at Amazon India located in Chennai, Tamil Nadu.	\N
63	Business Analyst	Flipkart	Chennai, Tamil Nadu	$116K - $167K	Remote	This is a description for Business Analyst at Flipkart located in Chennai, Tamil Nadu.	\N
64	Full Stack Developer	Reliance Digital	Gurugram, Haryana	$92K - $180K	Remote	This is a description for Full Stack Developer at Reliance Digital located in Gurugram, Haryana.	\N
65	UI/UX Designer	Wipro	Mumbai, Maharashtra	$103K - $157K	Remote	This is a description for UI/UX Designer at Wipro located in Mumbai, Maharashtra.	\N
66	Senior Frontend Developer	Microsoft India	Hyderabad, Telangana	$105K - $200K	Full-time	This is a description for Senior Frontend Developer at Microsoft India located in Hyderabad, Telangana.	\N
67	Cloud Architect	IBM India	Chennai, Tamil Nadu	$141K - $162K	Remote	This is a description for Cloud Architect at IBM India located in Chennai, Tamil Nadu.	\N
68	Full Stack Developer	Reliance Digital	Remote	$112K - $154K	Part-time	This is a description for Full Stack Developer at Reliance Digital located in Remote.	\N
69	Android Developer	Flipkart	Pune, Maharashtra	$140K - $178K	Full-time	This is a description for Android Developer at Flipkart located in Pune, Maharashtra.	\N
70	QA Engineer	Cognizant India	Mumbai, Maharashtra	$91K - $155K	Full-time	This is a description for QA Engineer at Cognizant India located in Mumbai, Maharashtra.	\N
71	Full Stack Developer	Mindtree	Ahmedabad, Gujarat	$107K - $161K	Full-time	This is a description for Full Stack Developer at Mindtree located in Ahmedabad, Gujarat.	\N
72	Cybersecurity Analyst	Reliance Digital	Ahmedabad, Gujarat	$126K - $179K	Full-time	This is a description for Cybersecurity Analyst at Reliance Digital located in Ahmedabad, Gujarat.	\N
73	Android Developer	Cognizant India	Gurugram, Haryana	$141K - $161K	Part-time	This is a description for Android Developer at Cognizant India located in Gurugram, Haryana.	\N
74	Product Manager	L&T Infotech	Mumbai, Maharashtra	$114K - $193K	Full-time	This is a description for Product Manager at L&T Infotech located in Mumbai, Maharashtra.	\N
75	Machine Learning Engineer	Tata Consultancy Services	Remote	$101K - $157K	Remote	This is a description for Machine Learning Engineer at Tata Consultancy Services located in Remote.	\N
76	Senior Frontend Developer	Infosys	Kolkata, West Bengal	$140K - $163K	Part-time	This is a description for Senior Frontend Developer at Infosys located in Kolkata, West Bengal.	\N
77	Cloud Architect	Microsoft India	Ahmedabad, Gujarat	$123K - $165K	Full-time	This is a description for Cloud Architect at Microsoft India located in Ahmedabad, Gujarat.	\N
78	Senior Frontend Developer	IBM India	Noida, Uttar Pradesh	$92K - $159K	Full-time	This is a description for Senior Frontend Developer at IBM India located in Noida, Uttar Pradesh.	\N
79	UI/UX Designer	Flipkart	Noida, Uttar Pradesh	$136K - $187K	Full-time	This is a description for UI/UX Designer at Flipkart located in Noida, Uttar Pradesh.	\N
80	Data Scientist	Google India	Remote	$101K - $195K	Full-time	This is a description for Data Scientist at Google India located in Remote.	\N
81	Cloud Architect	HCL Technologies	Gurugram, Haryana	$142K - $181K	Full-time	This is a description for Cloud Architect at HCL Technologies located in Gurugram, Haryana.	\N
82	UI/UX Designer	Tata Consultancy Services	Jaipur, Rajasthan	$146K - $180K	Full-time	This is a description for UI/UX Designer at Tata Consultancy Services located in Jaipur, Rajasthan.	\N
83	Cloud Architect	IBM India	Ahmedabad, Gujarat	$89K - $173K	Part-time	This is a description for Cloud Architect at IBM India located in Ahmedabad, Gujarat.	\N
84	QA Engineer	Tata Consultancy Services	Bengaluru, Karnataka	$140K - $193K	Part-time	This is a description for QA Engineer at Tata Consultancy Services located in Bengaluru, Karnataka.	\N
85	Full Stack Developer	Amazon India	Kolkata, West Bengal	$125K - $186K	Full-time	This is a description for Full Stack Developer at Amazon India located in Kolkata, West Bengal.	\N
86	UI/UX Designer	Amazon India	Noida, Uttar Pradesh	$143K - $152K	Full-time	This is a description for UI/UX Designer at Amazon India located in Noida, Uttar Pradesh.	\N
87	DevOps Engineer	L&T Infotech	Noida, Uttar Pradesh	$136K - $152K	Part-time	This is a description for DevOps Engineer at L&T Infotech located in Noida, Uttar Pradesh.	\N
88	Business Analyst	Google India	Bengaluru, Karnataka	$128K - $199K	Full-time	This is a description for Business Analyst at Google India located in Bengaluru, Karnataka.	\N
89	Machine Learning Engineer	Microsoft India	Chennai, Tamil Nadu	$134K - $193K	Part-time	This is a description for Machine Learning Engineer at Microsoft India located in Chennai, Tamil Nadu.	\N
90	QA Engineer	Infosys	Hyderabad, Telangana	$126K - $190K	Full-time	This is a description for QA Engineer at Infosys located in Hyderabad, Telangana.	\N
91	Machine Learning Engineer	Cognizant India	Jaipur, Rajasthan	$84K - $155K	Remote	This is a description for Machine Learning Engineer at Cognizant India located in Jaipur, Rajasthan.	\N
92	DevOps Engineer	IBM India	Pune, Maharashtra	$127K - $187K	Full-time	This is a description for DevOps Engineer at IBM India located in Pune, Maharashtra.	\N
93	QA Engineer	HCL Technologies	Ahmedabad, Gujarat	$82K - $164K	Remote	This is a description for QA Engineer at HCL Technologies located in Ahmedabad, Gujarat.	\N
94	Cybersecurity Analyst	Cognizant India	Kolkata, West Bengal	$131K - $191K	Full-time	This is a description for Cybersecurity Analyst at Cognizant India located in Kolkata, West Bengal.	\N
95	iOS Developer	L&T Infotech	Gurugram, Haryana	$121K - $187K	Full-time	This is a description for iOS Developer at L&T Infotech located in Gurugram, Haryana.	\N
96	Cloud Architect	Google India	Ahmedabad, Gujarat	$146K - $185K	Full-time	This is a description for Cloud Architect at Google India located in Ahmedabad, Gujarat.	\N
97	Cybersecurity Analyst	Cognizant India	Kolkata, West Bengal	$142K - $153K	Remote	This is a description for Cybersecurity Analyst at Cognizant India located in Kolkata, West Bengal.	\N
98	Product Manager	Infosys	Bengaluru, Karnataka	$107K - $183K	Remote	This is a description for Product Manager at Infosys located in Bengaluru, Karnataka.	\N
99	QA Engineer	Cognizant India	Bengaluru, Karnataka	$87K - $158K	Part-time	This is a description for QA Engineer at Cognizant India located in Bengaluru, Karnataka.	\N
100	Cloud Architect	Flipkart	Noida, Uttar Pradesh	$136K - $191K	Remote	This is a description for Cloud Architect at Flipkart located in Noida, Uttar Pradesh.	\N
101	Software Engineer	Infosys	Remote	$124K - $169K	Full-time	This is a description for Software Engineer at Infosys located in Remote.	\N
102	Backend Engineer	Cognizant India	Noida, Uttar Pradesh	$109K - $176K	Part-time	This is a description for Backend Engineer at Cognizant India located in Noida, Uttar Pradesh.	\N
103	Machine Learning Engineer	Google India	Bengaluru, Karnataka	$82K - $185K	Full-time	This is a description for Machine Learning Engineer at Google India located in Bengaluru, Karnataka.	\N
104	Cybersecurity Analyst	Amazon India	Noida, Uttar Pradesh	$109K - $165K	Remote	This is a description for Cybersecurity Analyst at Amazon India located in Noida, Uttar Pradesh.	\N
105	Data Scientist	Mindtree	Noida, Uttar Pradesh	$94K - $183K	Part-time	This is a description for Data Scientist at Mindtree located in Noida, Uttar Pradesh.	\N
106	Backend Engineer	IBM India	Pune, Maharashtra	$110K - $167K	Part-time	This is a description for Backend Engineer at IBM India located in Pune, Maharashtra.	\N
107	Backend Engineer	Amazon India	Kolkata, West Bengal	$85K - $161K	Remote	This is a description for Backend Engineer at Amazon India located in Kolkata, West Bengal.	\N
108	Backend Engineer	Reliance Digital	Remote	$108K - $152K	Full-time	This is a description for Backend Engineer at Reliance Digital located in Remote.	\N
109	Cybersecurity Analyst	Reliance Digital	Ahmedabad, Gujarat	$106K - $200K	Remote	This is a description for Cybersecurity Analyst at Reliance Digital located in Ahmedabad, Gujarat.	\N
110	iOS Developer	Cognizant India	Gurugram, Haryana	$106K - $175K	Remote	This is a description for iOS Developer at Cognizant India located in Gurugram, Haryana.	\N
111	UI/UX Designer	Cognizant India	Ahmedabad, Gujarat	$123K - $158K	Remote	This is a description for UI/UX Designer at Cognizant India located in Ahmedabad, Gujarat.	\N
112	QA Engineer	Tech Mahindra	Hyderabad, Telangana	$140K - $196K	Remote	This is a description for QA Engineer at Tech Mahindra located in Hyderabad, Telangana.	\N
113	Machine Learning Engineer	Reliance Digital	Bengaluru, Karnataka	$118K - $160K	Part-time	This is a description for Machine Learning Engineer at Reliance Digital located in Bengaluru, Karnataka.	\N
114	Cloud Architect	Amazon India	Gurugram, Haryana	$120K - $196K	Remote	This is a description for Cloud Architect at Amazon India located in Gurugram, Haryana.	\N
115	Data Scientist	Amazon India	Pune, Maharashtra	$100K - $179K	Part-time	This is a description for Data Scientist at Amazon India located in Pune, Maharashtra.	\N
116	iOS Developer	HCL Technologies	Pune, Maharashtra	$129K - $173K	Full-time	This is a description for iOS Developer at HCL Technologies located in Pune, Maharashtra.	\N
117	Machine Learning Engineer	Infosys	Gurugram, Haryana	$119K - $154K	Remote	This is a description for Machine Learning Engineer at Infosys located in Gurugram, Haryana.	\N
118	UI/UX Designer	Capgemini India	Mumbai, Maharashtra	$129K - $177K	Part-time	This is a description for UI/UX Designer at Capgemini India located in Mumbai, Maharashtra.	\N
119	Android Developer	Reliance Digital	Pune, Maharashtra	$129K - $175K	Part-time	This is a description for Android Developer at Reliance Digital located in Pune, Maharashtra.	\N
120	iOS Developer	Tech Mahindra	Bengaluru, Karnataka	$118K - $183K	Remote	This is a description for iOS Developer at Tech Mahindra located in Bengaluru, Karnataka.	\N
121	iOS Developer	Infosys	Ahmedabad, Gujarat	$105K - $157K	Part-time	This is a description for iOS Developer at Infosys located in Ahmedabad, Gujarat.	\N
122	Full Stack Developer	HCL Technologies	Jaipur, Rajasthan	$137K - $198K	Part-time	This is a description for Full Stack Developer at HCL Technologies located in Jaipur, Rajasthan.	\N
123	Mobile App Developer	Tech Mahindra	Noida, Uttar Pradesh	$133K - $196K	Full-time	This is a description for Mobile App Developer at Tech Mahindra located in Noida, Uttar Pradesh.	\N
124	iOS Developer	Tech Mahindra	Ahmedabad, Gujarat	$114K - $150K	Part-time	This is a description for iOS Developer at Tech Mahindra located in Ahmedabad, Gujarat.	\N
125	UI/UX Designer	Flipkart	Chennai, Tamil Nadu	$135K - $151K	Part-time	This is a description for UI/UX Designer at Flipkart located in Chennai, Tamil Nadu.	\N
126	Full Stack Developer	Google India	Bengaluru, Karnataka	$126K - $150K	Part-time	This is a description for Full Stack Developer at Google India located in Bengaluru, Karnataka.	\N
127	Software Engineer	L&T Infotech	Remote	$102K - $190K	Part-time	This is a description for Software Engineer at L&T Infotech located in Remote.	\N
128	UI/UX Designer	Capgemini India	Kolkata, West Bengal	$139K - $175K	Remote	This is a description for UI/UX Designer at Capgemini India located in Kolkata, West Bengal.	\N
129	Cybersecurity Analyst	Amazon India	Noida, Uttar Pradesh	$104K - $186K	Remote	This is a description for Cybersecurity Analyst at Amazon India located in Noida, Uttar Pradesh.	\N
130	Backend Engineer	Microsoft India	Bengaluru, Karnataka	$97K - $168K	Remote	This is a description for Backend Engineer at Microsoft India located in Bengaluru, Karnataka.	\N
131	Backend Engineer	IBM India	Hyderabad, Telangana	$101K - $193K	Full-time	This is a description for Backend Engineer at IBM India located in Hyderabad, Telangana.	\N
132	Software Engineer	Amazon India	Remote	$108K - $159K	Part-time	This is a description for Software Engineer at Amazon India located in Remote.	\N
133	Machine Learning Engineer	Mindtree	Pune, Maharashtra	$144K - $178K	Part-time	This is a description for Machine Learning Engineer at Mindtree located in Pune, Maharashtra.	\N
134	Cybersecurity Analyst	Amazon India	Kolkata, West Bengal	$91K - $160K	Remote	This is a description for Cybersecurity Analyst at Amazon India located in Kolkata, West Bengal.	\N
135	Cybersecurity Analyst	HCL Technologies	Mumbai, Maharashtra	$96K - $188K	Full-time	This is a description for Cybersecurity Analyst at HCL Technologies located in Mumbai, Maharashtra.	\N
136	Backend Engineer	IBM India	Jaipur, Rajasthan	$132K - $176K	Full-time	This is a description for Backend Engineer at IBM India located in Jaipur, Rajasthan.	\N
137	Product Manager	Flipkart	Jaipur, Rajasthan	$90K - $150K	Remote	This is a description for Product Manager at Flipkart located in Jaipur, Rajasthan.	\N
138	Full Stack Developer	IBM India	Noida, Uttar Pradesh	$114K - $153K	Remote	This is a description for Full Stack Developer at IBM India located in Noida, Uttar Pradesh.	\N
139	Product Manager	HCL Technologies	Hyderabad, Telangana	$138K - $164K	Remote	This is a description for Product Manager at HCL Technologies located in Hyderabad, Telangana.	\N
140	Backend Engineer	Reliance Digital	Mumbai, Maharashtra	$139K - $171K	Full-time	This is a description for Backend Engineer at Reliance Digital located in Mumbai, Maharashtra.	\N
141	iOS Developer	Infosys	Ahmedabad, Gujarat	$149K - $197K	Full-time	This is a description for iOS Developer at Infosys located in Ahmedabad, Gujarat.	\N
142	Machine Learning Engineer	L&T Infotech	Pune, Maharashtra	$97K - $200K	Part-time	This is a description for Machine Learning Engineer at L&T Infotech located in Pune, Maharashtra.	\N
143	Product Manager	Google India	Hyderabad, Telangana	$140K - $165K	Part-time	This is a description for Product Manager at Google India located in Hyderabad, Telangana.	\N
144	Business Analyst	Amazon India	Noida, Uttar Pradesh	$90K - $157K	Remote	This is a description for Business Analyst at Amazon India located in Noida, Uttar Pradesh.	\N
145	iOS Developer	Google India	Gurugram, Haryana	$106K - $176K	Part-time	This is a description for iOS Developer at Google India located in Gurugram, Haryana.	\N
146	Mobile App Developer	Tata Consultancy Services	Hyderabad, Telangana	$119K - $185K	Remote	This is a description for Mobile App Developer at Tata Consultancy Services located in Hyderabad, Telangana.	\N
147	DevOps Engineer	Amazon India	Noida, Uttar Pradesh	$97K - $188K	Remote	This is a description for DevOps Engineer at Amazon India located in Noida, Uttar Pradesh.	\N
148	Mobile App Developer	Wipro	Jaipur, Rajasthan	$143K - $196K	Part-time	This is a description for Mobile App Developer at Wipro located in Jaipur, Rajasthan.	\N
149	Mobile App Developer	HCL Technologies	Remote	$141K - $173K	Remote	This is a description for Mobile App Developer at HCL Technologies located in Remote.	\N
150	Backend Engineer	Tech Mahindra	Chennai, Tamil Nadu	$105K - $170K	Full-time	This is a description for Backend Engineer at Tech Mahindra located in Chennai, Tamil Nadu.	\N
151	Cybersecurity Analyst	IBM India	Kolkata, West Bengal	$119K - $161K	Full-time	This is a description for Cybersecurity Analyst at IBM India located in Kolkata, West Bengal.	\N
152	Cybersecurity Analyst	Wipro	Noida, Uttar Pradesh	$138K - $155K	Remote	This is a description for Cybersecurity Analyst at Wipro located in Noida, Uttar Pradesh.	\N
153	Product Manager	Capgemini India	Hyderabad, Telangana	$125K - $189K	Remote	This is a description for Product Manager at Capgemini India located in Hyderabad, Telangana.	\N
154	UI/UX Designer	Microsoft India	Ahmedabad, Gujarat	$116K - $153K	Part-time	This is a description for UI/UX Designer at Microsoft India located in Ahmedabad, Gujarat.	\N
155	Software Engineer	Amazon India	Bengaluru, Karnataka	$107K - $177K	Remote	This is a description for Software Engineer at Amazon India located in Bengaluru, Karnataka.	\N
156	Software Engineer	Capgemini India	Hyderabad, Telangana	$85K - $184K	Part-time	This is a description for Software Engineer at Capgemini India located in Hyderabad, Telangana.	\N
157	Senior Frontend Developer	Google India	Bengaluru, Karnataka	$122K - $178K	Full-time	This is a description for Senior Frontend Developer at Google India located in Bengaluru, Karnataka.	\N
158	Machine Learning Engineer	L&T Infotech	Hyderabad, Telangana	$148K - $177K	Part-time	This is a description for Machine Learning Engineer at L&T Infotech located in Hyderabad, Telangana.	\N
159	Android Developer	Tech Mahindra	Mumbai, Maharashtra	$137K - $164K	Remote	This is a description for Android Developer at Tech Mahindra located in Mumbai, Maharashtra.	\N
160	Senior Frontend Developer	Capgemini India	Kolkata, West Bengal	$95K - $194K	Part-time	This is a description for Senior Frontend Developer at Capgemini India located in Kolkata, West Bengal.	\N
161	Software Engineer	Cognizant India	Mumbai, Maharashtra	$109K - $163K	Full-time	This is a description for Software Engineer at Cognizant India located in Mumbai, Maharashtra.	\N
162	Business Analyst	Infosys	Hyderabad, Telangana	$124K - $185K	Part-time	This is a description for Business Analyst at Infosys located in Hyderabad, Telangana.	\N
163	iOS Developer	Cognizant India	Gurugram, Haryana	$145K - $193K	Remote	This is a description for iOS Developer at Cognizant India located in Gurugram, Haryana.	\N
164	iOS Developer	Infosys	Kolkata, West Bengal	$147K - $180K	Part-time	This is a description for iOS Developer at Infosys located in Kolkata, West Bengal.	\N
165	Machine Learning Engineer	Amazon India	Mumbai, Maharashtra	$133K - $188K	Remote	This is a description for Machine Learning Engineer at Amazon India located in Mumbai, Maharashtra.	\N
166	Product Manager	Cognizant India	Kolkata, West Bengal	$106K - $189K	Full-time	This is a description for Product Manager at Cognizant India located in Kolkata, West Bengal.	\N
167	Full Stack Developer	Reliance Digital	Ahmedabad, Gujarat	$83K - $179K	Full-time	This is a description for Full Stack Developer at Reliance Digital located in Ahmedabad, Gujarat.	\N
168	QA Engineer	Wipro	Ahmedabad, Gujarat	$96K - $183K	Remote	This is a description for QA Engineer at Wipro located in Ahmedabad, Gujarat.	\N
169	Cybersecurity Analyst	Wipro	Gurugram, Haryana	$140K - $180K	Full-time	This is a description for Cybersecurity Analyst at Wipro located in Gurugram, Haryana.	\N
170	UI/UX Designer	Infosys	Gurugram, Haryana	$146K - $199K	Remote	This is a description for UI/UX Designer at Infosys located in Gurugram, Haryana.	\N
171	Android Developer	IBM India	Mumbai, Maharashtra	$134K - $152K	Part-time	This is a description for Android Developer at IBM India located in Mumbai, Maharashtra.	\N
172	iOS Developer	Flipkart	Kolkata, West Bengal	$113K - $155K	Remote	This is a description for iOS Developer at Flipkart located in Kolkata, West Bengal.	\N
173	Android Developer	IBM India	Jaipur, Rajasthan	$93K - $197K	Remote	This is a description for Android Developer at IBM India located in Jaipur, Rajasthan.	\N
174	Mobile App Developer	Flipkart	Hyderabad, Telangana	$125K - $179K	Part-time	This is a description for Mobile App Developer at Flipkart located in Hyderabad, Telangana.	\N
175	Backend Engineer	IBM India	Bengaluru, Karnataka	$146K - $186K	Full-time	This is a description for Backend Engineer at IBM India located in Bengaluru, Karnataka.	\N
176	Cybersecurity Analyst	IBM India	Ahmedabad, Gujarat	$124K - $172K	Remote	This is a description for Cybersecurity Analyst at IBM India located in Ahmedabad, Gujarat.	\N
177	Android Developer	Wipro	Bengaluru, Karnataka	$133K - $159K	Full-time	This is a description for Android Developer at Wipro located in Bengaluru, Karnataka.	\N
178	Business Analyst	Tata Consultancy Services	Noida, Uttar Pradesh	$133K - $183K	Part-time	This is a description for Business Analyst at Tata Consultancy Services located in Noida, Uttar Pradesh.	\N
179	Mobile App Developer	Flipkart	Bengaluru, Karnataka	$97K - $170K	Full-time	This is a description for Mobile App Developer at Flipkart located in Bengaluru, Karnataka.	\N
180	Android Developer	Tech Mahindra	Noida, Uttar Pradesh	$120K - $173K	Remote	This is a description for Android Developer at Tech Mahindra located in Noida, Uttar Pradesh.	\N
181	Mobile App Developer	Wipro	Kolkata, West Bengal	$92K - $179K	Remote	This is a description for Mobile App Developer at Wipro located in Kolkata, West Bengal.	\N
182	Senior Frontend Developer	Tech Mahindra	Kolkata, West Bengal	$83K - $194K	Part-time	This is a description for Senior Frontend Developer at Tech Mahindra located in Kolkata, West Bengal.	\N
183	Business Analyst	IBM India	Noida, Uttar Pradesh	$89K - $173K	Full-time	This is a description for Business Analyst at IBM India located in Noida, Uttar Pradesh.	\N
184	UI/UX Designer	IBM India	Chennai, Tamil Nadu	$109K - $168K	Full-time	This is a description for UI/UX Designer at IBM India located in Chennai, Tamil Nadu.	\N
185	Android Developer	L&T Infotech	Chennai, Tamil Nadu	$136K - $167K	Part-time	This is a description for Android Developer at L&T Infotech located in Chennai, Tamil Nadu.	\N
186	Machine Learning Engineer	Tech Mahindra	Noida, Uttar Pradesh	$125K - $162K	Remote	This is a description for Machine Learning Engineer at Tech Mahindra located in Noida, Uttar Pradesh.	\N
187	QA Engineer	L&T Infotech	Remote	$93K - $153K	Part-time	This is a description for QA Engineer at L&T Infotech located in Remote.	\N
188	Business Analyst	Wipro	Gurugram, Haryana	$86K - $191K	Remote	This is a description for Business Analyst at Wipro located in Gurugram, Haryana.	\N
189	Backend Engineer	Flipkart	Bengaluru, Karnataka	$114K - $165K	Full-time	This is a description for Backend Engineer at Flipkart located in Bengaluru, Karnataka.	\N
190	Android Developer	HCL Technologies	Chennai, Tamil Nadu	$81K - $183K	Part-time	This is a description for Android Developer at HCL Technologies located in Chennai, Tamil Nadu.	\N
191	Cloud Architect	Amazon India	Gurugram, Haryana	$122K - $181K	Full-time	This is a description for Cloud Architect at Amazon India located in Gurugram, Haryana.	\N
192	Mobile App Developer	Cognizant India	Jaipur, Rajasthan	$113K - $167K	Part-time	This is a description for Mobile App Developer at Cognizant India located in Jaipur, Rajasthan.	\N
193	DevOps Engineer	L&T Infotech	Hyderabad, Telangana	$98K - $153K	Remote	This is a description for DevOps Engineer at L&T Infotech located in Hyderabad, Telangana.	\N
194	Android Developer	Google India	Gurugram, Haryana	$117K - $179K	Part-time	This is a description for Android Developer at Google India located in Gurugram, Haryana.	\N
195	Senior Frontend Developer	IBM India	Chennai, Tamil Nadu	$119K - $188K	Part-time	This is a description for Senior Frontend Developer at IBM India located in Chennai, Tamil Nadu.	\N
196	Software Engineer	Capgemini India	Ahmedabad, Gujarat	$146K - $150K	Remote	This is a description for Software Engineer at Capgemini India located in Ahmedabad, Gujarat.	\N
197	Machine Learning Engineer	HCL Technologies	Bengaluru, Karnataka	$146K - $155K	Full-time	This is a description for Machine Learning Engineer at HCL Technologies located in Bengaluru, Karnataka.	\N
198	Machine Learning Engineer	Reliance Digital	Ahmedabad, Gujarat	$95K - $171K	Part-time	This is a description for Machine Learning Engineer at Reliance Digital located in Ahmedabad, Gujarat.	\N
199	Cybersecurity Analyst	L&T Infotech	Bengaluru, Karnataka	$141K - $179K	Full-time	This is a description for Cybersecurity Analyst at L&T Infotech located in Bengaluru, Karnataka.	\N
200	DevOps Engineer	Tech Mahindra	Gurugram, Haryana	$124K - $182K	Remote	This is a description for DevOps Engineer at Tech Mahindra located in Gurugram, Haryana.	\N
201	Business Analyst	Flipkart	Gurugram, Haryana	$132K - $194K	Part-time	This is a description for Business Analyst at Flipkart located in Gurugram, Haryana.	\N
202	Android Developer	Google India	Pune, Maharashtra	$112K - $176K	Full-time	This is a description for Android Developer at Google India located in Pune, Maharashtra.	\N
203	DevOps Engineer	Wipro	Chennai, Tamil Nadu	$113K - $159K	Part-time	This is a description for DevOps Engineer at Wipro located in Chennai, Tamil Nadu.	\N
204	Machine Learning Engineer	Cognizant India	Chennai, Tamil Nadu	$105K - $155K	Full-time	This is a description for Machine Learning Engineer at Cognizant India located in Chennai, Tamil Nadu.	\N
205	Full Stack Developer	Tata Consultancy Services	Chennai, Tamil Nadu	$111K - $155K	Part-time	This is a description for Full Stack Developer at Tata Consultancy Services located in Chennai, Tamil Nadu.	\N
206	Android Developer	IBM India	Noida, Uttar Pradesh	$92K - $150K	Remote	This is a description for Android Developer at IBM India located in Noida, Uttar Pradesh.	\N
207	DevOps Engineer	Flipkart	Chennai, Tamil Nadu	$117K - $154K	Remote	This is a description for DevOps Engineer at Flipkart located in Chennai, Tamil Nadu.	\N
208	Backend Engineer	Tata Consultancy Services	Chennai, Tamil Nadu	$101K - $199K	Part-time	This is a description for Backend Engineer at Tata Consultancy Services located in Chennai, Tamil Nadu.	\N
209	Data Scientist	Tata Consultancy Services	Kolkata, West Bengal	$110K - $151K	Full-time	This is a description for Data Scientist at Tata Consultancy Services located in Kolkata, West Bengal.	\N
210	QA Engineer	Flipkart	Jaipur, Rajasthan	$113K - $193K	Remote	This is a description for QA Engineer at Flipkart located in Jaipur, Rajasthan.	\N
211	Full Stack Developer	Amazon India	Chennai, Tamil Nadu	$81K - $185K	Full-time	This is a description for Full Stack Developer at Amazon India located in Chennai, Tamil Nadu.	\N
212	Backend Engineer	L&T Infotech	Bengaluru, Karnataka	$127K - $188K	Part-time	This is a description for Backend Engineer at L&T Infotech located in Bengaluru, Karnataka.	\N
213	QA Engineer	Wipro	Kolkata, West Bengal	$148K - $155K	Full-time	This is a description for QA Engineer at Wipro located in Kolkata, West Bengal.	\N
214	Mobile App Developer	Microsoft India	Bengaluru, Karnataka	$134K - $176K	Full-time	This is a description for Mobile App Developer at Microsoft India located in Bengaluru, Karnataka.	\N
215	iOS Developer	L&T Infotech	Jaipur, Rajasthan	$82K - $192K	Remote	This is a description for iOS Developer at L&T Infotech located in Jaipur, Rajasthan.	\N
216	Full Stack Developer	L&T Infotech	Gurugram, Haryana	$105K - $155K	Full-time	This is a description for Full Stack Developer at L&T Infotech located in Gurugram, Haryana.	\N
217	Software Engineer	Google India	Jaipur, Rajasthan	$134K - $196K	Part-time	This is a description for Software Engineer at Google India located in Jaipur, Rajasthan.	\N
218	Machine Learning Engineer	Google India	Kolkata, West Bengal	$128K - $160K	Remote	This is a description for Machine Learning Engineer at Google India located in Kolkata, West Bengal.	\N
219	UI/UX Designer	Google India	Pune, Maharashtra	$129K - $151K	Remote	This is a description for UI/UX Designer at Google India located in Pune, Maharashtra.	\N
220	Business Analyst	Microsoft India	Chennai, Tamil Nadu	$150K - $186K	Part-time	This is a description for Business Analyst at Microsoft India located in Chennai, Tamil Nadu.	\N
221	Cloud Architect	Capgemini India	Hyderabad, Telangana	$100K - $196K	Part-time	This is a description for Cloud Architect at Capgemini India located in Hyderabad, Telangana.	\N
222	Software Engineer	Capgemini India	Mumbai, Maharashtra	$124K - $170K	Part-time	This is a description for Software Engineer at Capgemini India located in Mumbai, Maharashtra.	\N
223	Full Stack Developer	Infosys	Hyderabad, Telangana	$133K - $193K	Part-time	This is a description for Full Stack Developer at Infosys located in Hyderabad, Telangana.	\N
224	Product Manager	Tech Mahindra	Remote	$115K - $198K	Remote	This is a description for Product Manager at Tech Mahindra located in Remote.	\N
225	Backend Engineer	Amazon India	Jaipur, Rajasthan	$124K - $184K	Remote	This is a description for Backend Engineer at Amazon India located in Jaipur, Rajasthan.	\N
226	Data Scientist	Mindtree	Hyderabad, Telangana	$99K - $154K	Part-time	This is a description for Data Scientist at Mindtree located in Hyderabad, Telangana.	\N
227	Product Manager	Flipkart	Gurugram, Haryana	$147K - $190K	Part-time	This is a description for Product Manager at Flipkart located in Gurugram, Haryana.	\N
228	Data Scientist	Capgemini India	Kolkata, West Bengal	$88K - $151K	Part-time	This is a description for Data Scientist at Capgemini India located in Kolkata, West Bengal.	\N
229	Backend Engineer	HCL Technologies	Remote	$93K - $156K	Full-time	This is a description for Backend Engineer at HCL Technologies located in Remote.	\N
230	UI/UX Designer	Microsoft India	Pune, Maharashtra	$128K - $178K	Part-time	This is a description for UI/UX Designer at Microsoft India located in Pune, Maharashtra.	\N
231	UI/UX Designer	Flipkart	Jaipur, Rajasthan	$129K - $152K	Remote	This is a description for UI/UX Designer at Flipkart located in Jaipur, Rajasthan.	\N
232	DevOps Engineer	Microsoft India	Hyderabad, Telangana	$136K - $190K	Full-time	This is a description for DevOps Engineer at Microsoft India located in Hyderabad, Telangana.	\N
233	Cloud Architect	Microsoft India	Gurugram, Haryana	$115K - $196K	Remote	This is a description for Cloud Architect at Microsoft India located in Gurugram, Haryana.	\N
234	Cloud Architect	Google India	Ahmedabad, Gujarat	$104K - $162K	Remote	This is a description for Cloud Architect at Google India located in Ahmedabad, Gujarat.	\N
235	Full Stack Developer	Amazon India	Gurugram, Haryana	$86K - $162K	Remote	This is a description for Full Stack Developer at Amazon India located in Gurugram, Haryana.	\N
236	Data Scientist	Cognizant India	Noida, Uttar Pradesh	$94K - $156K	Remote	This is a description for Data Scientist at Cognizant India located in Noida, Uttar Pradesh.	\N
237	Cybersecurity Analyst	Tech Mahindra	Kolkata, West Bengal	$141K - $192K	Full-time	This is a description for Cybersecurity Analyst at Tech Mahindra located in Kolkata, West Bengal.	\N
238	Business Analyst	Infosys	Pune, Maharashtra	$142K - $178K	Part-time	This is a description for Business Analyst at Infosys located in Pune, Maharashtra.	\N
239	Backend Engineer	Wipro	Gurugram, Haryana	$96K - $151K	Full-time	This is a description for Backend Engineer at Wipro located in Gurugram, Haryana.	\N
240	DevOps Engineer	Mindtree	Ahmedabad, Gujarat	$83K - $165K	Remote	This is a description for DevOps Engineer at Mindtree located in Ahmedabad, Gujarat.	\N
241	Business Analyst	Mindtree	Gurugram, Haryana	$100K - $158K	Remote	This is a description for Business Analyst at Mindtree located in Gurugram, Haryana.	\N
282	Data Scientist	Cognizant India	Remote	$85K - $198K	Full-time	This is a description for Data Scientist at Cognizant India located in Remote.	\N
242	Machine Learning Engineer	Reliance Digital	Mumbai, Maharashtra	$109K - $155K	Remote	This is a description for Machine Learning Engineer at Reliance Digital located in Mumbai, Maharashtra.	\N
243	Full Stack Developer	Flipkart	Hyderabad, Telangana	$85K - $181K	Remote	This is a description for Full Stack Developer at Flipkart located in Hyderabad, Telangana.	\N
244	Mobile App Developer	Cognizant India	Gurugram, Haryana	$119K - $168K	Full-time	This is a description for Mobile App Developer at Cognizant India located in Gurugram, Haryana.	\N
245	Backend Engineer	L&T Infotech	Ahmedabad, Gujarat	$83K - $175K	Part-time	This is a description for Backend Engineer at L&T Infotech located in Ahmedabad, Gujarat.	\N
246	iOS Developer	Microsoft India	Ahmedabad, Gujarat	$143K - $183K	Part-time	This is a description for iOS Developer at Microsoft India located in Ahmedabad, Gujarat.	\N
247	QA Engineer	Flipkart	Kolkata, West Bengal	$117K - $178K	Part-time	This is a description for QA Engineer at Flipkart located in Kolkata, West Bengal.	\N
248	Mobile App Developer	Tata Consultancy Services	Bengaluru, Karnataka	$94K - $199K	Part-time	This is a description for Mobile App Developer at Tata Consultancy Services located in Bengaluru, Karnataka.	\N
249	QA Engineer	Google India	Noida, Uttar Pradesh	$80K - $197K	Part-time	This is a description for QA Engineer at Google India located in Noida, Uttar Pradesh.	\N
250	Product Manager	Amazon India	Chennai, Tamil Nadu	$130K - $200K	Part-time	This is a description for Product Manager at Amazon India located in Chennai, Tamil Nadu.	\N
251	iOS Developer	Cognizant India	Ahmedabad, Gujarat	$126K - $174K	Remote	This is a description for iOS Developer at Cognizant India located in Ahmedabad, Gujarat.	\N
252	iOS Developer	Microsoft India	Kolkata, West Bengal	$123K - $195K	Remote	This is a description for iOS Developer at Microsoft India located in Kolkata, West Bengal.	\N
253	Business Analyst	Reliance Digital	Pune, Maharashtra	$112K - $162K	Full-time	This is a description for Business Analyst at Reliance Digital located in Pune, Maharashtra.	\N
254	iOS Developer	HCL Technologies	Bengaluru, Karnataka	$89K - $160K	Remote	This is a description for iOS Developer at HCL Technologies located in Bengaluru, Karnataka.	\N
255	Senior Frontend Developer	Capgemini India	Remote	$119K - $167K	Remote	This is a description for Senior Frontend Developer at Capgemini India located in Remote.	\N
256	Android Developer	Cognizant India	Jaipur, Rajasthan	$107K - $186K	Part-time	This is a description for Android Developer at Cognizant India located in Jaipur, Rajasthan.	\N
257	Business Analyst	Tech Mahindra	Kolkata, West Bengal	$123K - $172K	Part-time	This is a description for Business Analyst at Tech Mahindra located in Kolkata, West Bengal.	\N
258	Android Developer	Cognizant India	Jaipur, Rajasthan	$126K - $168K	Full-time	This is a description for Android Developer at Cognizant India located in Jaipur, Rajasthan.	\N
259	Mobile App Developer	Mindtree	Ahmedabad, Gujarat	$90K - $159K	Remote	This is a description for Mobile App Developer at Mindtree located in Ahmedabad, Gujarat.	\N
260	UI/UX Designer	Capgemini India	Mumbai, Maharashtra	$116K - $189K	Part-time	This is a description for UI/UX Designer at Capgemini India located in Mumbai, Maharashtra.	\N
261	Data Scientist	Capgemini India	Mumbai, Maharashtra	$132K - $159K	Remote	This is a description for Data Scientist at Capgemini India located in Mumbai, Maharashtra.	\N
262	Business Analyst	HCL Technologies	Hyderabad, Telangana	$114K - $186K	Full-time	This is a description for Business Analyst at HCL Technologies located in Hyderabad, Telangana.	\N
263	Product Manager	Reliance Digital	Kolkata, West Bengal	$112K - $196K	Full-time	This is a description for Product Manager at Reliance Digital located in Kolkata, West Bengal.	\N
264	Business Analyst	Wipro	Gurugram, Haryana	$124K - $158K	Remote	This is a description for Business Analyst at Wipro located in Gurugram, Haryana.	\N
265	Data Scientist	Amazon India	Hyderabad, Telangana	$118K - $197K	Remote	This is a description for Data Scientist at Amazon India located in Hyderabad, Telangana.	\N
266	Data Scientist	Capgemini India	Ahmedabad, Gujarat	$149K - $154K	Full-time	This is a description for Data Scientist at Capgemini India located in Ahmedabad, Gujarat.	\N
267	UI/UX Designer	Reliance Digital	Bengaluru, Karnataka	$113K - $168K	Part-time	This is a description for UI/UX Designer at Reliance Digital located in Bengaluru, Karnataka.	\N
268	Mobile App Developer	Mindtree	Pune, Maharashtra	$93K - $181K	Remote	This is a description for Mobile App Developer at Mindtree located in Pune, Maharashtra.	\N
269	Backend Engineer	IBM India	Noida, Uttar Pradesh	$123K - $171K	Part-time	This is a description for Backend Engineer at IBM India located in Noida, Uttar Pradesh.	\N
270	Machine Learning Engineer	Tata Consultancy Services	Mumbai, Maharashtra	$90K - $196K	Part-time	This is a description for Machine Learning Engineer at Tata Consultancy Services located in Mumbai, Maharashtra.	\N
271	Data Scientist	Tech Mahindra	Hyderabad, Telangana	$149K - $181K	Full-time	This is a description for Data Scientist at Tech Mahindra located in Hyderabad, Telangana.	\N
272	Data Scientist	L&T Infotech	Pune, Maharashtra	$87K - $170K	Full-time	This is a description for Data Scientist at L&T Infotech located in Pune, Maharashtra.	\N
273	Android Developer	Capgemini India	Bengaluru, Karnataka	$110K - $195K	Part-time	This is a description for Android Developer at Capgemini India located in Bengaluru, Karnataka.	\N
274	Software Engineer	Capgemini India	Bengaluru, Karnataka	$132K - $188K	Remote	This is a description for Software Engineer at Capgemini India located in Bengaluru, Karnataka.	\N
275	Mobile App Developer	Wipro	Jaipur, Rajasthan	$107K - $189K	Full-time	This is a description for Mobile App Developer at Wipro located in Jaipur, Rajasthan.	\N
276	Senior Frontend Developer	Reliance Digital	Hyderabad, Telangana	$146K - $178K	Part-time	This is a description for Senior Frontend Developer at Reliance Digital located in Hyderabad, Telangana.	\N
277	Senior Frontend Developer	HCL Technologies	Pune, Maharashtra	$104K - $183K	Part-time	This is a description for Senior Frontend Developer at HCL Technologies located in Pune, Maharashtra.	\N
278	Full Stack Developer	IBM India	Hyderabad, Telangana	$122K - $195K	Full-time	This is a description for Full Stack Developer at IBM India located in Hyderabad, Telangana.	\N
279	Senior Frontend Developer	Reliance Digital	Bengaluru, Karnataka	$106K - $176K	Part-time	This is a description for Senior Frontend Developer at Reliance Digital located in Bengaluru, Karnataka.	\N
280	iOS Developer	Amazon India	Pune, Maharashtra	$106K - $194K	Part-time	This is a description for iOS Developer at Amazon India located in Pune, Maharashtra.	\N
281	QA Engineer	HCL Technologies	Ahmedabad, Gujarat	$126K - $194K	Full-time	This is a description for QA Engineer at HCL Technologies located in Ahmedabad, Gujarat.	\N
283	iOS Developer	Microsoft India	Noida, Uttar Pradesh	$108K - $155K	Remote	This is a description for iOS Developer at Microsoft India located in Noida, Uttar Pradesh.	\N
284	Full Stack Developer	Infosys	Jaipur, Rajasthan	$129K - $173K	Part-time	This is a description for Full Stack Developer at Infosys located in Jaipur, Rajasthan.	\N
285	Senior Frontend Developer	Amazon India	Chennai, Tamil Nadu	$91K - $163K	Remote	This is a description for Senior Frontend Developer at Amazon India located in Chennai, Tamil Nadu.	\N
286	Mobile App Developer	Cognizant India	Noida, Uttar Pradesh	$92K - $191K	Remote	This is a description for Mobile App Developer at Cognizant India located in Noida, Uttar Pradesh.	\N
287	Full Stack Developer	Google India	Remote	$129K - $193K	Full-time	This is a description for Full Stack Developer at Google India located in Remote.	\N
288	Software Engineer	Flipkart	Gurugram, Haryana	$139K - $193K	Part-time	This is a description for Software Engineer at Flipkart located in Gurugram, Haryana.	\N
289	Data Scientist	Wipro	Bengaluru, Karnataka	$89K - $177K	Part-time	This is a description for Data Scientist at Wipro located in Bengaluru, Karnataka.	\N
290	DevOps Engineer	Mindtree	Bengaluru, Karnataka	$90K - $158K	Part-time	This is a description for DevOps Engineer at Mindtree located in Bengaluru, Karnataka.	\N
291	Product Manager	Flipkart	Bengaluru, Karnataka	$111K - $194K	Part-time	This is a description for Product Manager at Flipkart located in Bengaluru, Karnataka.	\N
292	Android Developer	Tech Mahindra	Noida, Uttar Pradesh	$112K - $190K	Remote	This is a description for Android Developer at Tech Mahindra located in Noida, Uttar Pradesh.	\N
293	Cybersecurity Analyst	Reliance Digital	Hyderabad, Telangana	$140K - $163K	Part-time	This is a description for Cybersecurity Analyst at Reliance Digital located in Hyderabad, Telangana.	\N
294	DevOps Engineer	HCL Technologies	Noida, Uttar Pradesh	$105K - $197K	Remote	This is a description for DevOps Engineer at HCL Technologies located in Noida, Uttar Pradesh.	\N
295	Cybersecurity Analyst	Mindtree	Jaipur, Rajasthan	$90K - $157K	Full-time	This is a description for Cybersecurity Analyst at Mindtree located in Jaipur, Rajasthan.	\N
296	QA Engineer	Flipkart	Mumbai, Maharashtra	$145K - $190K	Part-time	This is a description for QA Engineer at Flipkart located in Mumbai, Maharashtra.	\N
297	Android Developer	L&T Infotech	Hyderabad, Telangana	$92K - $191K	Full-time	This is a description for Android Developer at L&T Infotech located in Hyderabad, Telangana.	\N
298	iOS Developer	IBM India	Remote	$92K - $168K	Full-time	This is a description for iOS Developer at IBM India located in Remote.	\N
299	iOS Developer	Amazon India	Hyderabad, Telangana	$117K - $193K	Part-time	This is a description for iOS Developer at Amazon India located in Hyderabad, Telangana.	\N
300	Software Engineer	HCL Technologies	Noida, Uttar Pradesh	$110K - $176K	Full-time	This is a description for Software Engineer at HCL Technologies located in Noida, Uttar Pradesh.	\N
301	Senior Frontend Developer	Cognizant India	Remote	$106K - $195K	Remote	This is a description for Senior Frontend Developer at Cognizant India located in Remote.	\N
302	Cloud Architect	Mindtree	Pune, Maharashtra	$89K - $162K	Part-time	This is a description for Cloud Architect at Mindtree located in Pune, Maharashtra.	\N
303	Business Analyst	Tata Consultancy Services	Remote	$99K - $161K	Part-time	This is a description for Business Analyst at Tata Consultancy Services located in Remote.	\N
304	iOS Developer	IBM India	Pune, Maharashtra	$106K - $172K	Remote	This is a description for iOS Developer at IBM India located in Pune, Maharashtra.	\N
305	Software Engineer	Flipkart	Pune, Maharashtra	$95K - $161K	Part-time	This is a description for Software Engineer at Flipkart located in Pune, Maharashtra.	\N
306	Data Scientist	Cognizant India	Pune, Maharashtra	$98K - $168K	Part-time	This is a description for Data Scientist at Cognizant India located in Pune, Maharashtra.	\N
307	Android Developer	Tech Mahindra	Remote	$130K - $188K	Remote	This is a description for Android Developer at Tech Mahindra located in Remote.	\N
308	Business Analyst	Reliance Digital	Bengaluru, Karnataka	$106K - $176K	Full-time	This is a description for Business Analyst at Reliance Digital located in Bengaluru, Karnataka.	\N
309	Backend Engineer	Capgemini India	Noida, Uttar Pradesh	$93K - $157K	Part-time	This is a description for Backend Engineer at Capgemini India located in Noida, Uttar Pradesh.	\N
310	Software Engineer	Tata Consultancy Services	Jaipur, Rajasthan	$91K - $184K	Part-time	This is a description for Software Engineer at Tata Consultancy Services located in Jaipur, Rajasthan.	\N
311	Product Manager	Infosys	Kolkata, West Bengal	$134K - $176K	Contract	This is a description for Product Manager at Infosys located in Kolkata, West Bengal.	\N
312	Software Engineer	Wipro	Ahmedabad, Gujarat	$94K - $181K	Full-time	This is a description for Software Engineer at Wipro located in Ahmedabad, Gujarat.	\N
313	iOS Developer	HCL Technologies	Gurugram, Haryana	$96K - $182K	Contract	This is a description for iOS Developer at HCL Technologies located in Gurugram, Haryana.	\N
314	Backend Engineer	Tech Mahindra	Chennai, Tamil Nadu	$80K - $163K	Contract	This is a description for Backend Engineer at Tech Mahindra located in Chennai, Tamil Nadu.	\N
315	Data Scientist	Mindtree	Bengaluru, Karnataka	$119K - $186K	Part-time	This is a description for Data Scientist at Mindtree located in Bengaluru, Karnataka.	\N
316	Cloud Architect	Cognizant India	Gurugram, Haryana	$126K - $167K	Remote	This is a description for Cloud Architect at Cognizant India located in Gurugram, Haryana.	\N
317	Senior Frontend Developer	Capgemini India	Noida, Uttar Pradesh	$116K - $169K	Full-time	This is a description for Senior Frontend Developer at Capgemini India located in Noida, Uttar Pradesh.	\N
318	Backend Engineer	L&T Infotech	Chennai, Tamil Nadu	$92K - $155K	Full-time	This is a description for Backend Engineer at L&T Infotech located in Chennai, Tamil Nadu.	\N
319	Senior Frontend Developer	IBM India	Ahmedabad, Gujarat	$86K - $165K	Contract	This is a description for Senior Frontend Developer at IBM India located in Ahmedabad, Gujarat.	\N
320	Cloud Architect	Google India	Noida, Uttar Pradesh	$106K - $165K	Remote	This is a description for Cloud Architect at Google India located in Noida, Uttar Pradesh.	\N
321	QA Engineer	Microsoft India	Chennai, Tamil Nadu	$96K - $174K	Full-time	This is a description for QA Engineer at Microsoft India located in Chennai, Tamil Nadu.	\N
322	DevOps Engineer	Amazon India	Hyderabad, Telangana	$95K - $153K	Full-time	This is a description for DevOps Engineer at Amazon India located in Hyderabad, Telangana.	\N
323	Business Analyst	Flipkart	Bengaluru, Karnataka	$92K - $184K	Part-time	This is a description for Business Analyst at Flipkart located in Bengaluru, Karnataka.	\N
324	QA Engineer	Reliance Digital	Gurugram, Haryana	$104K - $162K	Contract	This is a description for QA Engineer at Reliance Digital located in Gurugram, Haryana.	\N
325	Business Analyst	Reliance Digital	Bengaluru, Karnataka	$103K - $157K	Part-time	Job with Python skill at Reliance Digital in Bengaluru, Karnataka.	\N
326	Full Stack Developer	L&T Infotech	Kolkata, West Bengal	$138K - $161K	Remote	Job with JavaScript skill at L&T Infotech in Kolkata, West Bengal.	\N
327	DevOps Engineer	Flipkart	Jaipur, Rajasthan	$90K - $174K	Contract	Job with React skill at Flipkart in Jaipur, Rajasthan.	\N
328	Cybersecurity Analyst	Cognizant India	Gurugram, Haryana	$102K - $175K	Full-time	Job with Node.js skill at Cognizant India in Gurugram, Haryana.	\N
329	Cloud Architect	Flipkart	Bengaluru, Karnataka	$105K - $200K	Remote	Job with Django skill at Flipkart in Bengaluru, Karnataka.	\N
330	Mobile App Developer	Google India	Kolkata, West Bengal	$123K - $160K	Part-time	Job with TypeScript skill at Google India in Kolkata, West Bengal.	\N
331	Software Engineer	Microsoft India	Bengaluru, Karnataka	$86K - $168K	Full-time	Job with CSS skill at Microsoft India in Bengaluru, Karnataka.	\N
332	Data Scientist	Tech Mahindra	Mumbai, Maharashtra	$145K - $198K	Contract	Job with HTML skill at Tech Mahindra in Mumbai, Maharashtra.	\N
333	QA Engineer	Tata Consultancy Services	Bengaluru, Karnataka	$117K - $198K	Full-time	Job with Docker skill at Tata Consultancy Services in Bengaluru, Karnataka.	\N
334	Senior Frontend Developer	Tata Consultancy Services	Chennai, Tamil Nadu	$90K - $159K	Part-time	Job with AWS skill at Tata Consultancy Services in Chennai, Tamil Nadu.	\N
335	DevOps Engineer	Microsoft India	Hyderabad, Telangana	$108K - $194K	Part-time	This is a description for DevOps Engineer at Microsoft India located in Hyderabad, Telangana.	\N
336	Mobile App Developer	Wipro	Bengaluru, Karnataka	$130K - $171K	Remote	This is a description for Mobile App Developer at Wipro located in Bengaluru, Karnataka.	\N
337	Backend Engineer	Tech Mahindra	Chennai, Tamil Nadu	$93K - $190K	Contract	This is a description for Backend Engineer at Tech Mahindra located in Chennai, Tamil Nadu.	\N
338	Full Stack Developer	Capgemini India	Kolkata, West Bengal	$124K - $160K	Part-time	This is a description for Full Stack Developer at Capgemini India located in Kolkata, West Bengal.	\N
339	Machine Learning Engineer	Google India	Noida, Uttar Pradesh	$122K - $189K	Contract	This is a description for Machine Learning Engineer at Google India located in Noida, Uttar Pradesh.	\N
340	Machine Learning Engineer	Infosys	Pune, Maharashtra	$124K - $167K	Remote	This is a description for Machine Learning Engineer at Infosys located in Pune, Maharashtra.	\N
341	Business Analyst	L&T Infotech	Bengaluru, Karnataka	$122K - $153K	Part-time	This is a description for Business Analyst at L&T Infotech located in Bengaluru, Karnataka.	\N
342	Business Analyst	Amazon India	Kolkata, West Bengal	$99K - $174K	Part-time	This is a description for Business Analyst at Amazon India located in Kolkata, West Bengal.	\N
343	Machine Learning Engineer	Capgemini India	Bengaluru, Karnataka	$88K - $162K	Part-time	This is a description for Machine Learning Engineer at Capgemini India located in Bengaluru, Karnataka.	\N
344	Software Engineer	Reliance Digital	Mumbai, Maharashtra	$141K - $198K	Full-time	This is a description for Software Engineer at Reliance Digital located in Mumbai, Maharashtra.	\N
345	Software Engineer	Amazon India	Jaipur, Rajasthan	$127K - $186K	Part-time	This is a description for Software Engineer at Amazon India located in Jaipur, Rajasthan.	\N
346	DevOps Engineer	Cognizant India	Noida, Uttar Pradesh	$98K - $161K	Contract	This is a description for DevOps Engineer at Cognizant India located in Noida, Uttar Pradesh.	\N
347	iOS Developer	Flipkart	Mumbai, Maharashtra	$140K - $169K	Contract	This is a description for iOS Developer at Flipkart located in Mumbai, Maharashtra.	\N
348	Mobile App Developer	Flipkart	Gurugram, Haryana	$106K - $165K	Full-time	This is a description for Mobile App Developer at Flipkart located in Gurugram, Haryana.	\N
349	Machine Learning Engineer	Infosys	Gurugram, Haryana	$134K - $160K	Contract	This is a description for Machine Learning Engineer at Infosys located in Gurugram, Haryana.	\N
350	Business Analyst	Flipkart	Jaipur, Rajasthan	$147K - $187K	Part-time	This is a description for Business Analyst at Flipkart located in Jaipur, Rajasthan.	\N
351	QA Engineer	Infosys	Hyderabad, Telangana	$133K - $199K	Contract	This is a description for QA Engineer at Infosys located in Hyderabad, Telangana.	\N
352	Software Engineer	IBM India	Hyderabad, Telangana	$143K - $154K	Contract	This is a description for Software Engineer at IBM India located in Hyderabad, Telangana.	\N
353	Business Analyst	Microsoft India	Kolkata, West Bengal	$86K - $155K	Contract	This is a description for Business Analyst at Microsoft India located in Kolkata, West Bengal.	\N
354	Senior Frontend Developer	L&T Infotech	Remote	$80K - $181K	Remote	This is a description for Senior Frontend Developer at L&T Infotech located in Remote.	\N
355	Data Scientist	HCL Technologies	Noida, Uttar Pradesh	$149K - $178K	Part-time	This is a description for Data Scientist at HCL Technologies located in Noida, Uttar Pradesh.	\N
356	QA Engineer	L&T Infotech	Kolkata, West Bengal	$121K - $157K	Contract	This is a description for QA Engineer at L&T Infotech located in Kolkata, West Bengal.	\N
357	DevOps Engineer	Amazon India	Pune, Maharashtra	$120K - $162K	Remote	This is a description for DevOps Engineer at Amazon India located in Pune, Maharashtra.	\N
358	Android Developer	Wipro	Jaipur, Rajasthan	$135K - $165K	Remote	This is a description for Android Developer at Wipro located in Jaipur, Rajasthan.	\N
359	iOS Developer	Tata Consultancy Services	Bengaluru, Karnataka	$144K - $196K	Contract	This is a description for iOS Developer at Tata Consultancy Services located in Bengaluru, Karnataka.	\N
\.


--
-- Data for Name: resume_analyses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resume_analyses (id, filename, text_content, ats_score, strengths, improvements) FROM stdin;
1	Neha gor (1).pdf	\N	0	["Cannot analyze resume as the input provided is raw PDF file data, not readable text."]	["Please provide the resume content as plain text, or in a format that allows text extraction (e.g., a legible image or an actual PDF document that can be parsed for text).", "Raw PDF byte data cannot be processed for resume analysis.", "Ensure the resume content is accessible and parsable by automated systems for an accurate ATS score and analysis."]
2	HetPanchal_Resume.pdf	\N	0	["Unable to analyze content as the provided input is a raw PDF byte stream, not human-readable text.", "Cannot determine strengths without accessible text content."]	["To receive a proper analysis, please provide the resume content as plain text.", "Ensure the resume is in a universally readable format for ATS systems (e.g., proper text-searchable PDF or DOCX) to achieve a higher score.", "Cannot determine improvements without accessible text content."]
3	HetPanchal_Resume.pdf	\N	65	["Strong Technical Skillset: Demonstrates proficiency across a wide range of relevant technologies, including the MERN stack, Next.js, Redux, Python, and ML concepts.", "Relevant Project Experience: Showcases practical application of skills through a full-stack Learning Management System and an ongoing machine learning-focused Community Garbage Management System.", "Quantifiable Achievements: Includes strong academic scores (CPI: 8.92, percentages) and a significant LeetCode problem count (180+), indicating strong problem-solving abilities.", "Early Industry Exposure: Possesses an internship experience, demonstrating proactive engagement and real-world application of frontend development skills.", "Clean and Readable Format: Uses clear headings, bullet points, and a straightforward layout, making the resume easy to scan and digest for recruiters and ATS."]	["Correct Internship Date: The 'Dec 2024' date for the Frontend Development Intern role is in the future. This is a critical error and must be corrected to reflect the actual past or current duration (e.g., 'Dec 2023 - Jan 2024'). This will significantly impact ATS parsing and recruiter perception.", "Add Resume Summary/Objective: Include a concise summary or objective statement at the top to quickly highlight your key skills, career aspirations, and what you bring to a role.", "Quantify Internship Achievements Further: Enhance bullet points for the internship experience with more metrics. For example, instead of 'Optimized page performance', state 'Optimized page performance, leading to X% faster load times' or 'reduced rendering time by Y%'.", "Include Locations: Add city and country/state for all education entries and the internship experience (e.g., 'Indus University, Ahmedabad, Gujarat, India').", "Refine 'Skills' Categorization: The 'Programming Language' section mixes languages with frameworks, libraries, runtimes, and databases. Reorganize skills into more distinct categories like 'Programming Languages', 'Frameworks & Libraries', 'Databases', 'Tools', and 'Cloud Platforms' for better clarity and ATS parsing."]
4	Neha gor (2).pdf	\N	80	["Well-Organized and Clear Structure: The resume uses clear headings and a logical flow, making it easy for both ATS and human readers to digest information quickly.", "Strong Keyword Optimization: Excellent integration of relevant industry keywords (Digital Marketing, Web Development, Programming, SEO, Information Technology) ensures high ATS compatibility.", "Comprehensive Skill Showcase: Clearly differentiates and lists both technical (programming, web development, digital marketing) and soft skills (communication, teamwork), presenting a well-rounded candidate profile.", "Expresses Enthusiasm and Career Goals: The \\"ABOUT ME\\" section effectively communicates the candidate's eagerness to learn and build a career, which is valuable for an entry-level role.", "Multilingual Proficiency: Highlighting native/advanced fluency in three languages is a significant asset, especially in a globalized job market."]	["Incorporate a \\"Projects\\" Section: As a diploma candidate, adding a dedicated section for academic or personal projects would demonstrate practical application of learned skills and provide concrete examples of work.", "Add Quantifiable Achievements: Where possible (especially within projects), quantify results or contributions (e.g., \\"Developed a responsive website used by X users,\\" \\"Implemented SEO strategies resulting in Y% traffic increase\\").", "Refine \\"ABOUT ME\\" Summary: While enthusiastic, the summary could be more concise and immediately highlight key qualifications and specific career aspirations using stronger action-oriented language.", "Eliminate Redundancy: The \\"Technical Skills\\" heading appears twice, and \\"Diploma in Information Technology\\" is also repeated. Streamlining these repetitions would improve conciseness and flow.", "Utilize Strong Action Verbs: If projects or experiences are added, begin bullet points with powerful action verbs to describe accomplishments and responsibilities more effectively."]
5	\N	data science , ml , dl , nlp releted rag langchain know 	10	["Contains highly relevant and in-demand keywords for Data Science and AI/ML roles.", "Explicitly mentions modern and advanced AI concepts like RAG and LangChain.", "Clearly indicates a focus on specific technical domains (ML, DL, NLP).", "Directly communicates core areas of interest and perceived knowledge."]	["**Structure and Sections:** Develop into a complete resume with standard sections (e.g., Contact Information, Summary/Objective, Experience, Education, Skills, Projects).", "**Elaboration and Context:** Provide specific examples, projects, and quantifiable achievements for each skill mentioned, detailing *how* these technologies were applied.", "**Grammar and Professionalism:** Correct spelling errors (e.g., 'releted' to 'related') and phrase skills professionally, using strong action verbs where applicable.", "**Completeness:** Add crucial information such as work experience, educational background, contact details, and any relevant certifications.", "**Skill Categorization:** Organize skills into a dedicated 'Skills' section, possibly categorizing them (e.g., Programming Languages, Libraries, Tools, Concepts)."]
6	\N	data science , ml , dl , nlp releted rag langchain know also deel learning mri scan project , ai job careee prject , rag based chatbot project 	45	["**High Density of Relevant Keywords:** The snippet is packed with crucial keywords such as 'data science', 'ml', 'dl', 'nlp', 'rag', 'langchain', and 'deep learning', which are highly valuable for ATS matching in AI/ML roles.", "**Relevance to Current Industry Trends:** Includes cutting-edge technologies like 'RAG' (Retrieval-Augmented Generation) and 'Langchain', indicating an awareness of modern AI development practices.", "**Demonstrates Project Experience:** Mentions specific project areas like 'mri scan project', 'ai job career project', and 'rag based chatbot project', suggesting practical application of skills.", "**Clear Focus on AI/ML Domains:** Clearly indicates an interest and potential knowledge in core artificial intelligence and machine learning sub-domains, particularly NLP and deep learning."]	["**Structural Organization and Formatting:** The current format is a single, comma-separated string. It needs to be organized into proper resume sections (e.g., 'Skills', 'Projects', 'Summary') using bullet points for clarity and effective ATS parsing.", "**Grammar and Spelling Correction:** There are several typos and grammatical errors ('releted' should be 'related', 'deel' should be 'deep', 'careee' should be 'career', 'know also' is unidiomatic). These must be corrected for a professional impression.", "**Contextual Detail for Projects:** For each project listed, provide more specific details about its objective, the technologies used, your personal contributions, and any measurable outcomes or achievements.", "**Professional Language and Action Verbs:** Rewrite the content using professional language and strong action verbs (e.g., 'Developed', 'Implemented', 'Utilized') to describe skills and project involvement, rather than just listing terms.", "**Clarity and Conciseness:** Refine the phrasing to be more direct, clear, and impactful, removing informal or ambiguous expressions to enhance readability and professional tone."]
7	Neha gor (2).pdf	\N	60	["Clear and concise 'About Me' section outlining aspirations and core competencies relevant to IT and digital fields.", "Relevant technical skills listed, covering programming (Java, Python), web development (HTML, CSS), and digital marketing fundamentals (SEO Basics, Social Media Handling).", "Well-structured and clean resume format, making it easy to read and navigate.", "Strong language proficiency in English, Hindi, and Gujarati, which is a valuable asset in many professional environments."]	["**Add a dedicated 'Projects' section:** This is crucial for IT diploma candidates to demonstrate practical application of learned skills, showcase specific technologies used, and highlight contributions.", "**Elaborate on technical skills:** Instead of just listing, provide context or specify frameworks, tools, or specific areas of expertise within listed skills (e.g., 'Python (Django, Flask)', 'Web Development (Responsive Design, JavaScript frameworks)').", "**Proofread for redundancies and minor formatting issues:** 'Technical Skills' is listed twice, and 'Diploma in Information Technology' is incorrectly listed as a skill at the end. The contact information could be more cohesively placed under the name.", "**Quantify achievements where possible:** Even for academic work or potential future projects, describe the impact or scope using numbers (e.g., 'Developed a responsive website for X users', 'Contributed to a team project that improved Y efficiency by Z%').", "**Consider adding an 'Internship' or 'Experience' section:** Even if it's volunteer work, part-time roles, or short internships, any practical experience should be highlighted."]
8	Neha gor (2).pdf	\N	70	["Clear and concise 'About Me' section effectively introduces the candidate's eagerness and key skill areas.", "Well-organized structure with distinct headings (Education, Technical Skills, Soft Skills) makes it easy to navigate for both human readers and ATS.", "Includes a good mix of relevant technical skills such as Digital Marketing, Java, Python, HTML, CSS, and SEO basics.", "Highlights multilingual proficiency (English, Hindi, Gujarati), which can be a valuable asset in diverse work environments.", "Contact information (phone, email, location) is prominently displayed and easy to find."]	["**Add a 'Projects' Section:** This is the most critical missing element. Showcase academic, personal, or open-source projects (web development, Java/Python programs, digital marketing campaigns) to demonstrate practical application of skills.", "**Elaborate on Technical Skills:** Provide brief descriptions or examples for each technical skill to illustrate proficiency beyond just listing them (e.g., 'Java Programming (Developed a basic console application)').", "**Quantify Achievements:** Even in an academic context, add bullet points under the 'Diploma in Information Technology' to highlight relevant coursework, key achievements, or specific areas of study/projects.", "**Optimize 'About Me' Section:** While good, it could be more impactful by briefly mentioning specific career aspirations and how the listed skills align with those goals, or tailoring it slightly for target roles.", "**Refine 'Interests' Section:** Remove redundant entries like 'Technical Skills' and 'Diploma in Information Technology' as they are already covered. Focus interests on unique hobbies or specific areas of professional passion."]
\.


--
-- Data for Name: resume_analysis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resume_analysis (id, filename, text_content, ats_score, strengths, improvements, parsed_skills) FROM stdin;
1	HetPanchal_Resume.pdf	\N	88	["Strong Technical Skillset: Demonstrates proficiency in a wide range of modern web development technologies (MERN stack, Next.js, Redux, APIs) and foundational CS areas (DSA, C++, Python).", "Quantifiable Achievements: Includes academic scores (CPI: 8.92, percentages) and a significant LeetCode problem-solving count (180+ questions), providing concrete evidence of capability and dedication.", "Relevant Project Experience: Two detailed projects showcase practical application of skills, including a full-stack LMS and an ongoing machine learning/data science initiative, aligning well with stated interests.", "Clear Career Interest: Explicitly states 'Full Stack Development, Data Structures and Algorithms' as areas of interest, clearly signaling career aspirations and aligning skills and projects accordingly.", "Early Professional Exposure: The 'Frontend Development Intern' experience, even if short, indicates initiative and early exposure to a professional development environment."]	["Correct Internship Date: The internship date 'Dec 2024' is in the future. This is a critical error and should be corrected to the actual past date (e.g., Dec 2023 or earlier).", "Add Impact and Quantifiable Results: Enhance bullet points for experience and projects by detailing the impact, outcomes, or specific metrics achieved (e.g., 'reduced page load time by X%', 'supported Y users').", "Include a Professional Summary/Objective: A concise summary at the top can quickly introduce your career goals and highlight your most relevant qualifications to both ATS and human reviewers.", "Elaborate on Soft Skills: While listed, integrate examples of 'Problem Solving, Team Collaboration, Communication' within your experience and project descriptions to demonstrate them in action, rather than just listing them.", "Refine Skill Categorization: Consider separating skills into more distinct categories (e.g., 'Languages', 'Frameworks & Libraries', 'Databases', 'Tools') for improved readability and easier parsing by ATS systems and recruiters."]	\N
2	HetPanchal_Resume.pdf	\N	88	["Strong Technical Skillset: Comprehensive list of relevant technologies for full-stack development, including modern frameworks (React, Next.js, Node.js, Express.js) and databases (MongoDB), demonstrating a broad and current technical foundation.", "Relevant Project Experience: Two significant projects, including a full-stack Learning Management System and an ongoing AI/ML-focused Community Garbage Management System, showcasing practical application of skills and exposure to diverse technologies.", "Quantified Problem-Solving Ability: Explicitly states having solved 180+ questions on LeetCode, providing a clear metric for dedication to data structures, algorithms, and problem-solving skills.", "Early Professional Exposure: Includes a Frontend Development Internship (assuming the date is a typo for a past experience), which demonstrates early hands-on experience in a professional development environment.", "Clear and Organized Structure: The resume uses clear headings, bullet points, and a standard layout, making it easy for both ATS and human reviewers to quickly identify key information and skills."]	["Correct Internship Dates: The 'Dec 2024' date for the Frontend Development Intern role is in the future. This needs to be corrected immediately to reflect the actual past start and end dates of the internship.", "Quantify Impact and Achievements: Enhance bullet points for experience and projects with more specific metrics or results (e.g., 'Optimized page performance, leading to a X% improvement in load times,' 'Implemented authentication supporting Y number of users').", "Add a Professional Summary/Objective: Include a concise summary or objective statement at the top to quickly introduce your career goals and highlight your most relevant skills for the target roles, improving overall resume focus.", "Refine Skills Categorization: Separate the 'Programming Language' list into more distinct categories like 'Programming Languages' (C++, Python, JavaScript), 'Web Technologies/Frameworks' (React, Node.js, Next.js, Express.js, HTML, CSS), 'Databases' (MongoDB), and 'Tools/Libraries' (Redux, Tailwind CSS, REST APIs, Git, GitHub) for better clarity and ATS parsing.", "Elaborate on Soft Skills: While soft skills are listed, consider integrating examples of how 'Problem Solving' or 'Team Collaboration' were demonstrated within your project descriptions or internship experience to provide context and strengthen these claims."]	\N
3	Neha gor (3).pdf	\N	50	["Clear career objective and expressed enthusiasm for the IT and digital industry.", "Relevant foundational technical skills are listed, including programming languages (Java, Python) and web development (HTML, CSS), along with digital marketing skills (SEO Basics, Social Media Handling).", "Proficiency in multiple languages (English, Hindi, Gujarati) is a valuable asset, especially for diverse work environments.", "The resume is generally well-organized with distinct sections and bullet points, making it relatively easy to scan for key information."]	["**Add a 'Projects' or 'Experience' Section:** This is the most critical missing element. Detail any academic projects, personal projects, or internships. Include technologies used, your role, and quantifiable outcomes/contributions.", "**Elaborate on Education:** Include start and (expected) end dates for the Diploma. Consider adding relevant coursework, major projects, or a GPA if strong. For a professional resume, 10th standard details are generally not needed unless highly relevant to specific local hiring practices or very early career stages.", "**Enhance Technical Skills:** Be more specific with tools and frameworks (e.g., for Digital Marketing, mention specific platforms like Google Analytics, Facebook Ads; for Web Development, mention frameworks like Bootstrap, React, or databases like MySQL). Remove generic skills like 'Computer Basics'.", "**Refine 'About Me' Section:** Make it a more concise and impactful professional summary or objective. Highlight specific skills you bring to a role and what you aim to achieve, possibly mentioning a key project or area of specialization.", "**Proofread for Repetition and Redundancy:** Remove the duplicate 'Technical Skills' heading and the repeated 'Diploma in Information Technology' line at the end to ensure a clean and professional appearance and better ATS parsing."]	\N
4	HetPanchal_Resume.pdf	\N	45	["Features a comprehensive and modern full-stack development skill set highly relevant for junior roles.", "Showcases practical application of technical skills through multiple well-described personal and group projects.", "Includes a strong, quantifiable achievement of solving 180+ LeetCode questions, demonstrating problem-solving aptitude.", "Maintains a clear, standard resume structure with appropriate sections and bullet points, aiding readability."]	["Immediately correct the critical \\"Dec 2024\\" internship date to reflect an actual past period, as this is a major disqualifier for ATS and hiring managers.", "Add a concise professional summary or objective statement at the top to introduce the candidate and clearly articulate career aspirations.", "Include direct links to GitHub repositories or live project demos for each listed project to verify technical contributions and coding style.", "Quantify achievements and impact within experience and project descriptions using specific metrics, results, or outcomes to demonstrate value.", "Clarify the completion date of Class 12th to remove the apparent chronological overlap with the university start date, which can confuse ATS.", "Demonstrate soft skills like teamwork and communication through concrete examples within project or experience bullet points, rather than just listing them."]	\N
5	HetPanchal_Resume.pdf	\N	65	["Strong display of modern full-stack development skills, especially the MERN stack and Next.js.", "Impressive problem-solving aptitude evidenced by 180+ LeetCode questions with handle provided.", "Well-detailed projects showcasing practical application of diverse technologies including ML and data science.", "Clear and concise resume structure with good use of bullet points and standard sections."]	["Correct the 'Frontend Development Intern' date immediately to reflect actual employment period (start and end dates).", "Add the expected graduation date for your B.Tech degree to clarify your academic timeline.", "Include live demo links or GitHub repository links for all projects to allow direct evaluation of your work.", "Quantify project achievements with metrics or estimated impact to highlight specific contributions and results.", "Categorize skills into more distinct groups like 'Languages,' 'Frameworks,' 'Databases,' 'Tools,' and 'Concepts' for better readability and ATS parsing.", "Add a concise professional summary or objective statement at the top to highlight your career goals and key qualifications."]	\N
6	HetPanchal_Resume.pdf	\N	85	["Strong array of modern full-stack technologies listed, highly relevant for desired roles.", "Demonstrates proactive problem-solving skills through 180+ LeetCode questions solved.", "Projects showcase practical application of learned technologies and diverse problem-solving approaches.", "Clear and organized resume structure with good use of bullet points and relevant keywords."]	["Fix the 'Dec 2024' end date for the internship to reflect the actual past or current duration of the experience.", "Quantify achievements and impact in experience and project descriptions using specific metrics, results, or outcomes.", "Add a concise professional summary or objective at the top to highlight key skills, career goals, and value proposition.", "Include a direct link to a GitHub profile to showcase code samples, project repositories, and contribution history."]	\N
7	HetPanchal_Resume.pdf	\N	78	["Strong grasp of modern full-stack web development technologies (MERN, Next.js, Redux, etc.).", "Demonstrates practical application through two well-defined projects, including an innovative ML-focused one.", "Proactive in enhancing technical skills, evidenced by solving 180+ LeetCode problems.", "Clear, clean, and ATS-friendly resume formatting with essential sections present."]	["Crucially correct the internship end date as `Dec 2024` is in the future; ensure all dates are accurate.", "Add a concise professional summary or objective statement at the top to outline career goals.", "Quantify achievements in the experience section with metrics and impact (e.g., \\"optimized performance by X%\\").", "Provide links to project repositories (GitHub) or deployed applications to showcase work directly."]	\N
8	HetPanchal_Resume.pdf	\N	80	["Strong academic performance (CPI 8.92) in Computer Engineering demonstrates diligence.", "Diverse and relevant full-stack development skills, including modern frameworks and libraries, are well-listed.", "Demonstrates strong full-stack project experience with modern technologies and diverse functionalities.", "Active participation in LeetCode (180+ questions) highlights dedication to problem-solving and DSA."]	["Correct the internship date for A1Softec (Dec 2024 is in the future) to avoid immediate disqualification; clarify if completed or upcoming.", "Quantify achievements in the internship experience (e.g., impact, metrics) to demonstrate concrete value and results.", "Provide live demo links (GitHub repo, deployed application) for projects to allow direct verification of work.", "Add a concise professional summary or objective statement to clearly define career goals and value proposition to the employer."]	\N
9	Neha gor (3).pdf	\N	45	["Clear and concise \\"About Me\\" section effectively communicates career aspirations.", "Relevant technical skills are explicitly listed, aiding ATS keyword matching for entry-level roles.", "Inclusion of key soft skills like Communication and Problem Solving enhances appeal.", "Complete contact information and language proficiencies are well-presented."]	["Add a dedicated \\"Projects\\" section to showcase applied technical skills and provide quantifiable outcomes.", "Include dates for the Diploma in Information Technology to provide a clear timeline for education.", "Develop a professional summary tailored to a specific job role (e.g., Junior Web Developer) instead of a generic \\"About Me.\\"", "Quantify achievements within projects (e.g., \\"developed X website using Y, achieving Z result\\") to demonstrate impact.", "Create an online portfolio or GitHub link to provide tangible evidence of web development and programming skills.", "Expand on technical skills (e.g., specify platforms for \\"Social Media Handling,\\" list specific tools/frameworks for \\"Web Development\\").", "Remove redundant \\"Technical Skills\\" heading at the end and improve overall resume layout for clarity and professionalism.", "Consider adding an \\"Internship\\" or \\"Volunteer Experience\\" section if any relevant practical exposure exists."]	\N
10	HetPanchal_Resume.pdf	\N	70	["Strong foundation in diverse full-stack web development technologies and DSA.", "Demonstrated commitment to algorithmic problem-solving with 180+ LeetCode questions solved.", "Practical application of skills shown through two significant projects, including a full-stack LMS.", "Good academic standing with a CPI of 8.92 in an ongoing Computer Engineering degree."]	["Correct the 'Dec 2024' internship date, as it appears to be a typo or a future date listed under past experience.", "Add a concise professional summary or objective at the top to highlight career goals, key technical skills, and unique value proposition for target roles.", "Enhance experience and project bullet points with quantifiable achievements, specific outcomes, and metrics (e.g., 'reduced page load time by X%', 'handled Y concurrent users', 'implemented Z feature resulting in A').", "Elaborate on project descriptions to detail specific technical challenges faced, solutions implemented, and individual contributions, especially for the group project.", "Expand technical skills to include deployment platforms (e.g., Vercel, Netlify, AWS/GCP services), relational databases (e.g., PostgreSQL, MySQL), and testing frameworks (e.g., Jest, React Testing Library).", "Integrate soft skills (e.g., problem-solving, teamwork, communication) into project and experience bullet points with specific examples rather than just listing them.", "Pursue and list relevant certifications in web development (e.g., React, Node.js, cloud platforms like AWS/GCP Developer Associate) to demonstrate specialized knowledge and continuous learning.", "Develop a personal website or portfolio to showcase projects with live demos and provide links in the contact information section.", "Include competencies like version control best practices (e.g., branching strategies), security considerations (e.g., XSS, CSRF), and API design principles (RESTful best practices) to demonstrate a holistic understanding of software development."]	\N
11	HetPanchal_Resume.pdf	\N	78	["Possesses a strong and modern full-stack development skill set (MERN, Next.js, Redux, Tailwind CSS).", "Demonstrates practical application of skills through two well-defined projects, including an ML component.", "Showcases strong problem-solving and algorithmic capabilities through 180+ LeetCode questions.", "Gained relevant hands-on experience through a frontend development internship.", "Achieved a commendable academic performance with a CPI of 8.92."]	["Correct the internship dates for 'Frontend Development Intern, A1Softec' to reflect actual past dates or duration, and quantify achievements with metrics (e.g., 'optimized performance by X%' or 'reduced page load time by Y seconds').", "Quantify project impacts and outcomes with specific metrics, such as user adoption, performance improvements, or specific functionalities delivered, to demonstrate tangible value (e.g., 'supported X concurrent users', 'processed Y data points').", "Broaden the 'Tools and Technologies' section to include essential development practices like testing frameworks (e.g., Jest, React Testing Library), CI/CD principles, and basic cloud deployment experience (e.g., Vercel, Netlify, or an introductory AWS/GCP project).", "Add an 'About Me' or 'Objective' section at the top to concisely introduce your career goals (e.g., seeking a Full Stack Developer role) and highlight your key technical skills and achievements relevant to the target position.", "Organize the 'Skills' section into clear, distinct categories such as 'Programming Languages', 'Frontend Frameworks', 'Backend Technologies', 'Databases', and 'Developer Tools' for better readability and ATS parsing.", "Enhance project visibility by providing live demo links or direct GitHub repository links for each project, allowing hiring managers to easily review your code and deployed applications."]	\N
12	HetPanchal_Resume.pdf	\N	70	["Demonstrates a strong foundation in MERN stack and related frontend technologies.", "Excellent academic performance with a high CPI.", "Proven problem-solving skills with 180+ LeetCode questions solved.", "Active engagement in impactful full-stack and interdisciplinary projects, including ML/DS."]	["Fix the critical 'Dec 2024' date for the Frontend Development Intern role to reflect the actual past duration and quantify achievements with specific metrics (e.g., 'optimized page load time by X%', 'increased user engagement by Y%').", "Add GitHub repository links and live demo links for all projects to allow direct verification, and quantify project impact (e.g., 'handled Z concurrent users,' 'processed N data points').", "Expand technical skillset by including exposure to cloud platforms (AWS, Azure, GCP), SQL databases (PostgreSQL/MySQL), and testing frameworks (Jest, React Testing Library) through dedicated projects or certifications.", "Showcase deployment experience by detailing how projects were deployed (e.g., Vercel, Netlify, Heroku, AWS EC2) and explore basic DevOps concepts like Docker and CI/CD pipelines to demonstrate production readiness.", "Refine skill categorization by organizing the 'Programming Language' section into more accurate categories like 'Languages,' 'Frameworks/Libraries,' 'Databases,' and 'Tools' for better readability and ATS parsing."]	\N
13	Het_resume (2).pdf	\N	55	["Professional summary effectively highlights expertise in modern AI/ML domains, including Generative AI, LLMs, and RAG systems.", "Comprehensive technical skills section covers relevant AI/ML, NLP, programming, frameworks, and database technologies.", "Project descriptions demonstrate practical application of skills with quantifiable achievements and impact.", "Strong academic performance (CGPA 9.38) in a relevant engineering discipline showcases foundational knowledge.", "Visible proficiency in highly demanded tools like LangChain, FastAPI, PyTorch, and various vector databases."]	["Fix the incomplete 'DubSync' project description to ensure the resume is polished and professional, avoiding immediate disqualification due to errors.", "Address the critical lack of professional experience by actively seeking and securing internships in AI/ML engineering, data science, or related fields to apply skills in a real-world setting.", "Gain hands-on experience with major cloud platforms (AWS, GCP, Azure) and their AI/ML services (e.g., SageMaker, Vertex AI) through personal projects or certifications to meet industry deployment standards.", "Strengthen MLOps capabilities by learning and implementing tools for experiment tracking (MLflow, Weights & Biases), model monitoring, CI/CD for ML, and data versioning (DVC) in projects.", "Elaborate on data pipeline and engineering skills by incorporating tools like Apache Airflow, Spark, or Kafka into projects to demonstrate end-to-end ML solution development beyond basic databases.", "Showcase advanced deployment strategies, including container orchestration (Kubernetes) and serverless functions (e.g., AWS Lambda), to demonstrate ability to build scalable and robust ML applications.", "Highlight communication and collaboration skills within project descriptions, detailing contributions in team settings or presentation experiences, essential for senior roles."]	\N
14	Resume_Het.pdf	\N	88	["Excellent keyword density and relevance for AI/ML/Generative AI roles across the summary and skills.", "Strong academic record (9.38 CGPA) and relevant core computer engineering coursework.", "Quantified impact and specific technology usage clearly demonstrated in the \\"CareerWizard\\" project.", "Comprehensive technical skill set encompassing modern AI/ML frameworks, tools, and databases."]	["Add the expected graduation date to the Education section for crucial hiring timeline clarity.", "Provide a full description with bullet points, technologies, and quantifiable impact for the \\"DubSync\\" project, matching the detail of \\"CareerWizard.\\"", "Enhance MLOps visibility by integrating explicit experience with cloud platforms (AWS/GCP/Azure), CI/CD, or dedicated MLOps tools (e.g., MLflow, Kubeflow) into project descriptions to demonstrate end-to-end solution capabilities.", "Consider developing a personal portfolio website or a blog showcasing project deep dives or technical articles to demonstrate expertise and thought leadership beyond GitHub."]	\N
15	Resume_Het.pdf	\N	80	["Strong academic background with a high CGPA and relevant coursework in AI/ML/Deep Learning.", "Comprehensive technical skill set covering core AI/ML, Generative AI, NLP, and various frameworks/tools.", "Project descriptions effectively quantify achievements with clear metrics, demonstrating practical application and impact.", "Professional summary is impactful, keyword-rich, and clearly articulates specialization and target roles."]	["Resume completeness: The document cuts off mid-project, which is a critical flaw; ensure the entire resume is included with all sections finished and proofread meticulously.", "Cloud & MLOps experience: Add projects or certifications demonstrating practical experience with cloud platforms (e.g., AWS, Azure, GCP) for model deployment, MLOps tools (e.g., MLflow, Kubeflow), and CI/CD pipelines.", "Soft skills demonstration: Integrate explicit examples of soft skills (e.g., problem-solving, collaboration, leadership) within project descriptions or a dedicated 'Experience' section to show practical application.", "Portfolio diversification & validation: Include links to a well-maintained GitHub repository for all projects, consider adding a Kaggle profile, or open-source contributions to further validate technical skills and initiative."]	\N
16	Resume_Het.pdf	\N	75	["Exceptional technical proficiency in modern AI/ML/Generative AI tools (LLMs, RAG, LangChain, Vector DBs, FastAPI, Docker) relevant for target roles.", "Strong academic performance with a high CGPA and relevant coursework indicating a solid theoretical foundation in Computer Engineering.", "Demonstrated ability to build end-to-end ML applications and quantify project impact with clear metrics, especially in the 'CareerWizard' project.", "Well-structured and keyword-rich professional summary effectively highlighting specialization and key competencies."]	["Secure relevant internships (e.g., AI/ML Engineer Intern, Data Scientist Intern) to gain practical industry experience and apply learned skills in a professional setting. Missing skills/competencies: Industry workflow, cross-functional collaboration, real-world project constraints. Projects/experiences to include: 1-2 internships in AI/ML or related fields.", "Complete the 'DubSync' project description with detailed accomplishments, technologies used, and quantifiable impact to showcase a comprehensive project portfolio. Missing skills/competencies: Attention to detail, complete project showcasing. Projects/experiences to include: Fully detailed project descriptions for all listed projects.", "Strengthen the MLOps aspect by detailing CI/CD pipeline experience, model monitoring, and cloud deployment (AWS, GCP, Azure) in projects. Missing skills/competencies: Cloud platforms (AWS SageMaker, Azure ML, GCP AI Platform), Kubernetes, MLOps tools beyond Docker. Projects/experiences to include: A project involving end-to-end cloud deployment with CI/CD or a relevant MLOps certification.", "Integrate soft skills into project bullet points by describing specific instances of problem-solving, collaboration, or communication that led to project success, rather than listing them generically. Missing skills/competencies: Demonstrated application of soft skills in a professional context. Projects/experiences to include: Re-phrased project bullets showcasing specific contributions leveraging soft skills."]	\N
17	hetresume.pdf	\N	88	["Excellent command of modern Generative AI and NLP technologies, including LLMs, RAG, LangChain, and fine-tuning (LoRA/PEFT).", "Strong foundational technical skills in Deep Learning, core ML frameworks (PyTorch, TensorFlow, Scikit-learn), and Python.", "Demonstrated project impact with clear, quantifiable metrics, such as '60%+ ATS score accuracy' and '40% reduction in user search time'.", "Proficiency in essential MLOps basics (Docker, Git/GitHub, CI/CD) and specialized vector databases (Pinecone, FAISS, ChromaDB).", "Outstanding academic performance (CGPA 9.38) with a highly relevant B.Tech curriculum in Computer Engineering.", "Active GitHub profile linked, showcasing code and project contributions, which is a significant plus for technical roles."]	["Complete the 'DubSync' project description with specific technologies used, quantifiable achievements, and demonstrated impact to fully showcase its value.", "Add explicit details on MLOps implementation (e.g., MLflow, Kubeflow, Airflow for orchestration, model monitoring) to demonstrate production readiness beyond basic CI/CD and Docker.", "Obtain relevant cloud certifications (e.g., AWS Certified Machine Learning Specialty or Google Cloud Professional Machine Learning Engineer) to validate cloud deployment expertise.", "Develop or contribute to a project focused on robust data engineering for ML, including data warehousing, complex ETL pipelines, and data quality checks using tools like Apache Spark or Flink.", "Seek an internship or co-op position to gain professional, real-world experience applying AI/ML skills in a structured team environment.", "Quantify the 'measurable improvements' mentioned in the professional summary with specific metrics from completed projects.", "Showcase soft skills more explicitly within project descriptions, detailing how analytical thinking, problem-solving, or collaboration led to specific project successes."]	\N
18	hetresume.pdf	\N	75	["Strong technical skills in modern AI/ML/DL, Generative AI, NLP, LLMs, RAG, LangChain, and vector databases.", "Well-quantified project achievements demonstrating tangible impact and problem-solving abilities with clear metrics.", "Excellent visibility of relevant programming languages (Python), frameworks (PyTorch, TensorFlow, FastAPI), and development tools.", "Active GitHub profile and LinkedIn link provide strong credibility and access to practical work examples."]	["Revise the 'Professional Summary' to accurately reflect current student status (e.g., 'Aspiring AI/ML Engineer' or 'Computer Engineering Student specializing in...') to better align with educational background and target roles.", "Fully detail the 'DubSync' project, including technologies, challenges, and measurable outcomes, to present a complete and impactful view of capabilities.", "Add an 'Internship Experience' section if applicable, or integrate academic research or teaching assistant roles to demonstrate practical application of skills in a structured environment.", "Enhance MLOps and deployment competencies by showcasing projects with CI/CD for ML, model monitoring, or by pursuing industry-relevant certifications like AWS Machine Learning Specialty to validate expertise."]	\N
19	hetresume.pdf	\N	90	["Strong keyword optimization with relevant AI/ML, Generative AI, NLP, and MLOps terms throughout.", "Demonstrates practical application of skills through multiple, well-defined projects with quantified impact.", "Proficient in a comprehensive and modern technical stack including PyTorch, TensorFlow, LangChain, FastAPI, and AWS.", "Solid foundation in core computer science concepts (DS&A) and relevant coursework for AI/ML roles."]	["Seek relevant internships or entry-level AI/ML engineer positions to gain professional experience and apply skills in an industry setting, moving beyond academic projects.", "Enhance MLOps and cloud deployment skills by building projects leveraging advanced services like AWS SageMaker, MLflow, or Kubeflow for end-to-end model lifecycle management, monitoring, and scaling.", "Expand data engineering competencies by working on projects involving complex data pipelines, feature stores (e.g., Feast), or data orchestration tools (e.g., Airflow) to strengthen large-scale data preparation expertise.", "Contribute to open-source AI/ML projects or participate in team-based hackathons to demonstrate collaborative coding, version control, and experience working on larger, shared codebases."]	\N
\.


--
-- Data for Name: roadmaps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roadmaps (id, user_id, domain, content, progress, created_at) FROM stdin;
1	1	gen ai	{"domain": "gen ai", "months": 1, "content": {"months": [{"month": "Month 1: Foundational Gen AI & Applied LLM Engineering", "goal": "Gain a solid understanding of core Generative AI concepts, master advanced prompt engineering, and implement basic to intermediate LLM-powered applications, including Retrieval Augmented Generation (RAG) and initial fine-tuning experiments.", "isComplete": true, "weeks": [{"title": "Weeks 1-2: Core Concepts, Prompt Engineering & Integration", "topics": ["Transformer Architecture Deep Dive (Attention Mechanisms, Encoders/Decoders)", "Large Language Models (LLMs): Taxonomy, Capabilities, and Limitations (GPT-x, Llama-x, Mistral)", "Advanced Prompt Engineering Techniques: Few-shot, Chain-of-Thought, Tree-of-Thought, Role-Play Prompting", "Embeddings and Vector Databases: Understanding Cosine Similarity, ANN Indexes (FAISS, Pinecone, ChromaDB)", "Introduction to LangChain/LlamaIndex for Orchestration and Agentic Workflows", "Generative Paradigms: Text Generation (Completion, Chat), Code Generation, Image Generation (Diffusion Models Overview)", "Evaluation Metrics for LLM Outputs: Perplexity, ROUGE, BLEU, BERTScore (qualitative vs. quantitative)"], "miniProject": ["Develop a multi-turn conversational AI chatbot using LangChain and a commercial LLM API (e.g., OpenAI, Anthropic).", "Implement a document question-answering system using a vector database and a pre-trained embedding model (e.g., BGE, OpenAI Embeddings).", "Create a prompt engineering playground to compare outputs from different LLMs and prompting strategies for a specific task (e.g., creative writing, code generation).", "Build a simple agent that can search the web and summarize information using tools integration within LangChain."], "resources": ["YouTube: Andrej Karpathy (LLM series), The AI Epiphany, Hugging Face (NLP/Transformers tutorials)", "Course: DeepLearning.AI \\u2013 'Generative AI with Large Language Models' & 'Prompt Engineering for Developers'", "Tool: OpenAI API Documentation, Hugging Face Transformers Documentation, LangChain Documentation, LlamaIndex Documentation"]}, {"title": "Weeks 3-4: RAG, Fine-tuning Foundations & Deployment Considerations", "topics": ["Advanced Retrieval Augmented Generation (RAG): Chunking Strategies, Reranking, Hybrid Search, Multi-Vector RAG", "Parameter-Efficient Fine-Tuning (PEFT) Techniques: LoRA, QLoRA, Adapter tuning for smaller LLMs (e.g., Llama 2, Mistral)", "Data Preparation and Curation for Fine-tuning: Instruction Tuning, Dataset Augmentation, Quality Filtering", "Model Evaluation for Fine-tuned Models: Task-specific metrics, human evaluation frameworks, A/B testing", "LLM Deployment Considerations: API Gateways, Model Serving (TGI, vLLM), Quantization, Cost Optimization", "Ethical AI and Responsible Development: Bias Detection, Guardrails (NeMo Guardrails, Llama Guard), Data Privacy, Explainability (XAI basics)", "Introduction to MLOps for Gen AI: Experiment Tracking (MLflow, W&B), Version Control for Datasets/Models (DVC)"], "miniProject": ["Fine-tune a smaller open-source LLM (e.g., Llama 2 7B, Mistral 7B) using LoRA on a domain-specific dataset (e.g., customer support tickets, legal documents).", "Design and implement a robust RAG pipeline incorporating advanced features like hybrid search and a reranking model to improve answer quality.", "Develop a basic LLM application and deploy it using a simple web framework (e.g., FastAPI/Streamlit) with an emphasis on cost monitoring and basic logging.", "Set up an experiment tracking system (e.g., MLflow, Weights & Biases) to monitor metrics during a fine-tuning job and compare different PEFT configurations."], "resources": ["YouTube: Weights & Biases (W&B), Stanford CS324 (Readings/Lectures), The AIEP (Advanced RAG tutorials)", "Course: Hugging Face 'NLP Course' (advanced fine-tuning sections), Fast.ai 'Practical Deep Learning for Coders'", "Tool: PEFT Library Documentation, vLLM Documentation, MLflow Documentation, AWS SageMaker/GCP Vertex AI (Gen AI services) Docs"]}], "skillsToMaster": ["Advanced Prompt Engineering & Optimization", "LLM API Integration & Orchestration (LangChain/LlamaIndex)", "Retrieval Augmented Generation (RAG) System Design & Implementation", "Parameter-Efficient Fine-Tuning (PEFT) & Dataset Curation for LLMs", "Foundational Understanding of Transformer Architectures and LLM Mechanics", "LLM Evaluation Methodologies (Quantitative & Qualitative)", "Basic LLM Deployment & MLOps Practices (Experiment Tracking, Cost Management)", "Ethical AI Principles and Guardrail Integration for Gen AI Applications"]}]}}	{}	2026-02-14 16:27:42.340052+05:30
2	1	gen ai	{"domain": "gen ai", "months": 3, "content": {"months": [{"month": "Month 1: Foundations of Generative AI & Prompt Engineering", "goal": "Master core generative AI concepts, prompt engineering techniques, and practical API interactions to build basic Gen AI applications.", "isComplete": true, "weeks": [{"title": "Weeks 1-2: Core Concepts & Foundational LLMs", "topics": ["Introduction to Transformer Architecture (Encoder-Decoder, Decoder-only)", "Self-Attention Mechanism & Multi-Head Attention", "Positional Embeddings and Tokenization", "Overview of leading LLM architectures (GPT-X, LLaMA, BERT, T5)", "Text Embeddings and their role in semantic search", "Introduction to Vector Databases (Pinecone, Weaviate, Milvus)", "Basic Prompt Engineering: Zero-shot, Few-shot prompting", "OpenAI API Integration (Completion, Chat Completion, Embedding APIs)"], "miniProject": ["Build a simple chatbot using OpenAI's Chat Completion API with user-defined personas.", "Develop a text summarizer that leverages prompt engineering for concise outputs.", "Implement a semantic search engine using OpenAI embeddings and a vector database (e.g., Pinecone free tier).", "Create a basic image generation script using a public API (e.g., DALL-E 2/3 or Stable Diffusion via Hugging Face API)."], "resources": ["YouTube: Andrej Karpathy - 'Let's build GPT: from scratch, in code, spelled out.'", "YouTube: The AI Epiphany - 'Transformers Explained: The Full Story'", "Course: DeepLearning.AI - 'Generative AI with Large Language Models'", "Tool: OpenAI API Documentation", "Tool: Hugging Face Transformers Library Documentation"]}, {"title": "Weeks 3-4: Advanced Prompting, RAG & LangChain Fundamentals", "topics": ["Advanced Prompt Engineering: Chain-of-Thought (CoT), Tree-of-Thought (ToT), Self-Consistency", "Retrieval-Augmented Generation (RAG) architecture and principles", "Chunking strategies and indexing for RAG", "Evaluating RAG systems (qualitative and quantitative methods)", "Introduction to LangChain: Chains, Agents, Prompts, Models, Retrievers, Document Loaders", "Building custom tools and agents with LangChain", "Introduction to diffusion models (DDPM conceptual understanding)", "Ethical considerations in prompt design and basic model interactions"], "miniProject": ["Implement a RAG system for a specific domain (e.g., financial reports, academic papers) using LangChain, a vector DB, and a local PDF loader.", "Build a LangChain agent that can interact with two distinct tools (e.g., a search API and a calculator).", "Design and test various advanced prompting techniques (CoT, few-shot) to solve complex reasoning tasks.", "Create a Gradio/Streamlit UI for a simple RAG-powered Q&A application."], "resources": ["YouTube: LangChain Official Channel - 'LangChain Tutorial for Beginners'", "YouTube: DeepLearning.AI - 'Building Systems with the ChatGPT API'", "Course: DeepLearning.AI - 'LangChain for LLM Application Development'", "Website: LangChain Documentation", "Website: Prompt Engineering Guide (promptingguide.ai)"]}], "skillsToMaster": ["Python for AI/ML Development", "API Interaction (RESTful APIs for LLMs)", "Prompt Engineering (Zero-shot, Few-shot, CoT, etc.)", "Vector Database Usage (embeddings, indexing, retrieval)", "LangChain Framework Proficiency", "Basic RAG System Implementation"]}, {"month": "Month 2: Advanced Generative Models & Fine-tuning", "goal": "Gain practical experience with advanced generative models, fine-tuning techniques, and evaluate model performance for specific use cases.", "isComplete": false, "weeks": [{"title": "Weeks 1-2: Parameter Efficient Fine-Tuning & Diffusion Models", "topics": ["Parameter-Efficient Fine-Tuning (PEFT) methods: LoRA, QLoRA, Adapter Tuning", "Full Fine-tuning vs. PEFT: Trade-offs and use cases", "Quantization techniques (8-bit, 4-bit) for memory efficiency (bitsandbytes)", "Practical fine-tuning an open-source LLM (e.g., LLaMA-2, Mistral) using Hugging Face `Trainer`/`SFTTrainer`", "Dataset preparation for fine-tuning (instruction tuning, domain adaptation)", "Deeper dive into Diffusion Models: Latent Diffusion, ControlNet, Image-to-Image", "Model evaluation metrics for Text Generation (BLEU, ROUGE, Perplexity) and Image Generation (FID, Inception Score)", "Understanding bias and fairness in fine-tuning datasets"], "miniProject": ["Fine-tune a small open-source LLM (e.g., LLaMA-2 7B) using LoRA for a specific task (e.g., customer support assistant, code generation).", "Implement a ControlNet-style image generation workflow using a pre-trained Stable Diffusion model to guide generation.", "Compare the performance of a base LLM vs. its LoRA-fine-tuned counterpart using appropriate evaluation metrics.", "Build a custom dataset for instruction tuning from a raw text corpus and fine-tune a model with it."], "resources": ["YouTube: Hugging Face - 'PEFT: Parameter-Efficient Fine-Tuning'", "YouTube: Yannic Kilcher - 'Stable Diffusion Explained'", "Course: Full Stack LLM Bootcamp (Hugging Face / Weights & Biases)", "Tool: Hugging Face PEFT Library Documentation", "Tool: bitsandbytes Documentation"]}, {"title": "Weeks 3-4: Advanced RAG, Agents & MLOps for Gen AI", "topics": ["Advanced RAG strategies: HyDE, query expansion, re-ranking, ensemble retrieval", "Multi-Agent systems: Orchestration, communication, and planning", "Tool use for LLM Agents: Function Calling, custom tools, API integration", "Introduction to MLOps for Generative AI: Model versioning, experiment tracking (MLflow, Weights & Biases)", "Data Version Control (DVC) for datasets used in fine-tuning", "Model serving basics: FastAPI for model inference, containerization (Docker)", "Generative Adversarial Networks (GANs): Architecture, training challenges, conditional GANs", "Memory mechanisms for LLM agents (short-term, long-term, knowledge graphs)"], "miniProject": ["Develop an advanced RAG system incorporating query expansion and re-ranking for improved answer quality.", "Build a multi-agent system (e.g., a research agent and a summarization agent) that collaborates to answer a complex query.", "Create a FastAPI endpoint to serve a fine-tuned LLM, containerize it with Docker, and test its inference.", "Implement a simple conditional GAN to generate images based on specific attributes (e.g., MNIST digits with specific numbers)."], "resources": ["YouTube: Weights & Biases - 'MLOps for LLMs'", "YouTube: ArXiv Insights - 'Deep Dive into Generative Adversarial Networks'", "Course: DeepLearning.AI - 'Generative AI with Diffusion Models'", "Website: MLflow Documentation", "Website: FastAPI Documentation", "Website: LangChain Advanced Topics"]}], "skillsToMaster": ["Parameter-Efficient Fine-Tuning (LoRA, QLoRA)", "Model Evaluation & Metrics for Gen AI", "Advanced RAG Architectures", "LLM Agent Design & Tool Use", "Basic MLOps for LLMs (versioning, tracking, serving)", "Docker for model deployment"]}, {"month": "Month 3: Cutting-edge Architectures, Deployment & Responsible AI", "goal": "Explore state-of-the-art generative models, production deployment strategies, and delve into ethical implications and advanced research topics.", "isComplete": false, "weeks": [{"title": "Weeks 1-2: Multi-Modal AI, Advanced Serving & Optimization", "topics": ["Multi-modal AI: Vision-Language Models (CLIP, BLIP, LLaVA, Flamingo concept)", "Mixture of Experts (MoE) architectures (e.g., Mixtral): principles and benefits", "Reinforcement Learning from Human Feedback (RLHF): core concepts, alignment, and limitations", "Advanced Model Serving: Triton Inference Server, BentoML, Ray Serve for distributed inference", "Inference optimization: Quantization (AWQ, GPTQ), pruning, distillation, TensorRT-LLM basics", "Distributed training concepts: DeepSpeed, FSDP for large model training/fine-tuning", "Model Monitoring: Drift detection, performance tracking in production", "Introduction to AI safety and alignment research"], "miniProject": ["Build a multi-modal application that takes an image and a text query to generate a contextually relevant response (e.g., using LLaVA or a similar open-source model).", "Deploy a fine-tuned LLM using BentoML or Triton Inference Server for scalable inference.", "Experiment with different quantization techniques (e.g., AWQ vs. QLoRA) for a given model and compare latency/throughput.", "Set up a basic model monitoring dashboard for a deployed Gen AI application."], "resources": ["YouTube: Weights & Biases - 'From LoRA to MoE with LLMs'", "YouTube: DeepLearning.AI - 'Large Language Models with Reinforcement Learning'", "Course: Stanford CS224N (Advanced Topics/Project Focus)", "Tool: TensorRT-LLM Documentation", "Tool: BentoML Documentation", "Website: ArXiv (for latest research papers)"]}, {"title": "Weeks 3-4: Advanced Agentic Systems, Ethics & Future Trends", "topics": ["Advanced Agentic systems: Self-correction, memory management (vector stores, knowledge graphs), planning algorithms (tree-of-thought, state-space search)", "LLM Security: Prompt injection, data leakage, adversarial attacks on LLMs", "Responsible AI Development: Fairness, accountability, transparency, privacy-preserving techniques (federated learning for Gen AI)", "Model Explainability (XAI) for LLMs: LIME, SHAP, attention visualization", "Synthetic Data Generation: Techniques and applications (e.g., for data augmentation, privacy)", "Gen AI in specific domains: Scientific discovery, drug design, creative arts", "Review of cutting-edge research papers and upcoming trends (e.g., AGI paths, novel architectures)", "Legal and societal implications of widespread Gen AI adoption"], "miniProject": ["Design and implement an LLM agent with advanced planning and self-correction capabilities to solve a multi-step problem (e.g., complex coding task, scientific literature review).", "Conduct a mini-audit of an open-source LLM for potential biases or vulnerabilities to prompt injection attacks.", "Explore techniques for generating synthetic tabular data or text data for a given domain.", "Write a critical analysis of a recent Gen AI research paper, proposing extensions or improvements."], "resources": ["YouTube: AI Explained - 'LLM Safety and Alignment'", "YouTube: DataCamp - 'Responsible AI: Fairness, Explainability, and Privacy'", "Course: Fast.ai - 'Practical Deep Learning for Coders' (focus on advanced topics/research)", "Website: OpenAI Blog (for latest research updates)", "Website: EleutherAI (open research community)"]}], "skillsToMaster": ["Multi-modal AI Integration", "Advanced Model Serving & Inference Optimization", "RLHF Concepts & Model Alignment", "Responsible AI Principles & Practices", "LLM Security & Explainability", "Distributed Training Concepts", "Ability to analyze and adapt to new research"]}]}}	{}	2026-02-14 16:33:33.780239+05:30
3	1	gen ai	{"domain": "gen ai", "months": 1, "content": {"months": [{"month": "Month 1: GenAI Fundamentals, Prompt Engineering & Initial RAG", "goal": "Develop a strong understanding of core GenAI concepts, master advanced prompt engineering techniques, build initial hands-on experience with pre-trained models and foundational RAG systems.", "isComplete": true, "weeks": [{"title": "Weeks 1-2: Core Concepts, Prompt Engineering & LLM Basics", "topics": ["Transformer Architecture: Attention Mechanism, Encoder-Decoder Stacks", "Large Language Model (LLM) Fundamentals: Pre-training, Transfer Learning, Fine-tuning Concepts", "Tokenization Strategies: BPE, WordPiece, SentencePiece and their implications", "Advanced Prompt Engineering: Zero-shot, Few-shot, Chain-of-Thought (CoT), Tree-of-Thought (ToT) Prompting", "Context Window Management: Techniques for extending context, window sliding, summarization", "Embeddings: Generation, use-cases for semantic search and retrieval", "Introduction to Retrieval Augmented Generation (RAG): Core principles, components (vector stores, retrievers)", "Model Evaluation Metrics for Text Generation: Perplexity, BLEU, ROUGE, Human Evaluation Criteria"], "miniProject": ["Build an interactive prompt engineering playground for a specific task (e.g., complex multi-step reasoning, creative story generation) using OpenAI or Anthropic APIs.", "Implement a basic document Q&A system using a pre-trained LLM and a simple in-memory vector store (e.g., FAISS or ChromaDB) to demonstrate RAG.", "Compare the performance and cost of different LLM providers (e.g., OpenAI, Anthropic, Hugging Face Inference API) for a common task using varied prompting strategies.", "Develop a system to automatically generate varied and challenging prompts for a given LLM to test its robustness and identify failure modes."], "resources": ["YouTube: DeepLearning.AI GenAI series with Andrew Ng", "YouTube: Hugging Face channel tutorials on Transformers and Embeddings", "YouTube: The AI Epiphany - Conceptual deep dives into LLMs", "Course: DeepLearning.AI \\u2013 'Generative AI with Large Language Models'", "Course: Coursera \\u2013 'Prompt Engineering for ChatGPT'", "Tool: OpenAI API Documentation", "Tool: Anthropic API Documentation", "Tool: Hugging Face Transformers Documentation"]}, {"title": "Weeks 3-4: Advanced RAG, Fine-tuning Basics & Deployment Concepts", "topics": ["Advanced RAG Architectures: Query rewriting, Hybrid Search (keyword + semantic), Multi-stage RAG, Re-ranking", "Vector Databases in Depth: Deep dive into Pinecone, Weaviate, Milvus, Qdrant, and their indexing strategies", "Fine-tuning Open-Source LLMs: Parameter-Efficient Fine-Tuning (PEFT) techniques like LoRA and QLoRA", "Dataset Preparation for Fine-tuning: Instruction tuning, supervised fine-tuning data formats", "Introduction to LLM Deployment: FastAPI for API serving, Docker containerization, basic cloud deployment (AWS SageMaker/GCP Vertex AI concepts)", "Evaluation of RAG Systems: Context relevance, faithfulness, answer correctness metrics", "Agentic AI Systems: Introduction to tool use, function calling, planning, and simple agentic loops", "Ethical AI in GenAI: Bias detection, fairness metrics, toxicity mitigation, data privacy concerns"], "miniProject": ["Build an advanced RAG system for a specific domain (e.g., legal documents, medical research) incorporating query rewriting and a re-ranking step using LangChain/LlamaIndex and a chosen vector database.", "Perform basic fine-tuning of a smaller open-source LLM (e.g., Llama-2-7b or Mistral) on a custom, small instruction dataset using LoRA.", "Develop a proof-of-concept web application using FastAPI that exposes an LLM API, demonstrating basic serving and Docker packaging.", "Create a simple AI agent that can use a few external tools (e.g., a calculator API, a weather API) to answer multi-step questions."], "resources": ["YouTube: The Full Stack Deep Learning (for MLOps & LLMOps insights)", "YouTube: DataTalks.Club (especially LLMOps series)", "YouTube: Weights & Biases (W&B) tutorials on fine-tuning and experiment tracking", "Course: DeepLearning.AI \\u2013 'Building Generative AI Applications with LangChain'", "Course: DataCamp \\u2013 'Fine-tuning Large Language Models'", "Tool: LangChain / LlamaIndex Official Documentation", "Tool: PEFT / bitsandbytes GitHub Repositories and Docs", "Tool: Pinecone / Weaviate / ChromaDB / Qdrant Official Documentation"]}], "skillsToMaster": ["Advanced Prompt Engineering (CoT, ToT, Self-Correction)", "Retrieval Augmented Generation (RAG) System Design & Optimization", "Parameter-Efficient Fine-Tuning (PEFT) with LoRA/QLoRA", "LLM Evaluation & Benchmarking (for generation and RAG)", "Vector Database Utilization (indexing, querying, optimization)", "Basic MLOps for GenAI (Deployment via FastAPI, Docker)", "Agentic AI Fundamentals (Tool Use, Planning)", "Understanding of GenAI Ethical Considerations & Bias Mitigation"]}]}}	{}	2026-02-14 16:34:44.051184+05:30
\.


--
-- Data for Name: skill_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill_progress (id, user_id, role_key, progress_data, updated_at) FROM stdin;
1	2	fullStack	{"phase_0_topic_0": true, "phase_0_topic_1": true, "phase_0_topic_2": true, "phase_0_topic_3": true, "phase_0_topic_4": true, "phase_0_topic_5": true, "phase_0_topic_6": true, "phase_0_topic_7": true, "phase_0_topic_8": true, "phase_0_topic_9": true, "phase_0_complete": true}	2026-03-14 07:06:07.490168
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (id, name) FROM stdin;
1	React
2	TypeScript
3	JavaScript
4	CSS
5	Node.js
6	Python
7	Django
8	PostgreSQL
9	Docker
10	AWS
11	Terraform
12	Kubernetes
13	Jenkins
14	Machine Learning
15	CI/CD
16	Microservices
17	Java
18	SQL
19	Swift
20	Angular
21	Git
22	Flutter
23	Vue.js
24	HTML
\.


--
-- Data for Name: user_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_activities (id, user_id, activity_type, details, created_at) FROM stdin;
1	2	interview_prep	Fetched all questions for role Full Stack Developer	2026-03-12 05:52:30.274029
2	2	interview_prep	Fetched all questions for role Full Stack Developer	2026-03-12 05:52:34.303902
3	2	interview_prep	Fetched all questions for role Full Stack Developer	2026-03-12 05:52:37.559103
4	2	interview_prep	Fetched all questions for role Full Stack Developer	2026-03-12 05:52:40.06343
5	2	interview_prep	Fetched all questions for role Full Stack Developer	2026-03-12 05:53:14.836187
6	2	interview_prep	Fetched all questions for role Deep Learning Engineer	2026-03-12 05:53:44.892816
7	2	interview_prep	Fetched all questions for role Deep Learning Engineer	2026-03-12 05:53:46.793062
8	2	interview_prep	Fetched all questions for role Deep Learning Engineer	2026-03-12 05:53:47.893768
9	2	interview_prep	Fetched all questions for role Full Stack Developer	2026-03-12 05:53:53.468193
10	2	interview_prep	Fetched all questions for role Backend Developer	2026-03-12 05:54:04.932558
11	2	interview_prep	Fetched all questions for role Backend Developer	2026-03-12 05:54:09.4217
12	2	interview_prep	Fetched all questions for role Backend Developer	2026-03-12 05:54:10.167725
13	2	roadmap_progress	Updated progress for fullStack	2026-03-14 07:06:07.244507
14	2	interview_prep	Fetched all questions for role Generative AI Engineer (GenAI)	2026-03-14 07:06:25.913243
15	2	interview_prep	Fetched all questions for role Generative AI Engineer (GenAI)	2026-03-14 07:06:43.595279
16	2	interview_prep	Fetched all questions for role Generative AI Engineer (GenAI)	2026-03-14 07:06:45.197233
17	2	interview_prep	Fetched all questions for role Backend Developer	2026-03-15 07:01:51.539119
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, user_id, location, linkedin_url, bio, experience, skills, target_roles, resume_file_path) FROM stdin;
1	1	\N	\N	\N	\N	\N	\N	uploads/b33b9a4e-2850-4312-8668-5e8cb6c3c88d_HetPanchal_Resume.pdf
\.


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (id, user_id, question_id, is_completed, is_bookmarked, user_notes, updated_at, ai_explanation) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password) FROM stdin;
1	het	het80630@gmail.com	$2b$12$p/176KrmPS7eiFQzbVyMP.6NUAK3wBTyNOHHvM0Jtya30ztxfrEhW
2	Het Panchal	aaa@111.com	$2b$12$YS.3zTXs5zJcXcsHzDR13OrpWYKetwmMwuqAZsbZxiYLiH8JSE5mq
\.


--
-- Name: domain_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.domain_progress_id_seq', 1, false);


--
-- Name: interview_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interview_questions_id_seq', 831, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 359, true);


--
-- Name: resume_analyses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resume_analyses_id_seq', 8, true);


--
-- Name: resume_analysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resume_analysis_id_seq', 19, true);


--
-- Name: roadmaps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roadmaps_id_seq', 3, true);


--
-- Name: skill_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skill_progress_id_seq', 1, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 24, true);


--
-- Name: user_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_activities_id_seq', 17, true);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 1, true);


--
-- Name: user_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_progress_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: domain_progress domain_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domain_progress
    ADD CONSTRAINT domain_progress_pkey PRIMARY KEY (id);


--
-- Name: interview_questions interview_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_questions
    ADD CONSTRAINT interview_questions_pkey PRIMARY KEY (id);


--
-- Name: job_skill job_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_skill
    ADD CONSTRAINT job_skill_pkey PRIMARY KEY (job_id, skill_id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: resume_analyses resume_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resume_analyses
    ADD CONSTRAINT resume_analyses_pkey PRIMARY KEY (id);


--
-- Name: resume_analysis resume_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resume_analysis
    ADD CONSTRAINT resume_analysis_pkey PRIMARY KEY (id);


--
-- Name: roadmaps roadmaps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roadmaps
    ADD CONSTRAINT roadmaps_pkey PRIMARY KEY (id);


--
-- Name: skill_progress skill_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_progress
    ADD CONSTRAINT skill_progress_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_domain_progress_domain; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_domain_progress_domain ON public.domain_progress USING btree (domain);


--
-- Name: ix_domain_progress_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_domain_progress_id ON public.domain_progress USING btree (id);


--
-- Name: ix_interview_questions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_interview_questions_id ON public.interview_questions USING btree (id);


--
-- Name: ix_jobs_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_jobs_id ON public.jobs USING btree (id);


--
-- Name: ix_resume_analyses_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_resume_analyses_id ON public.resume_analyses USING btree (id);


--
-- Name: ix_resume_analysis_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_resume_analysis_id ON public.resume_analysis USING btree (id);


--
-- Name: ix_roadmaps_domain; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_roadmaps_domain ON public.roadmaps USING btree (domain);


--
-- Name: ix_roadmaps_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_roadmaps_id ON public.roadmaps USING btree (id);


--
-- Name: ix_skill_progress_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_skill_progress_id ON public.skill_progress USING btree (id);


--
-- Name: ix_skill_progress_role_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_skill_progress_role_key ON public.skill_progress USING btree (role_key);


--
-- Name: ix_skill_progress_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_skill_progress_user_id ON public.skill_progress USING btree (user_id);


--
-- Name: ix_skills_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_skills_id ON public.skills USING btree (id);


--
-- Name: ix_skills_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_skills_name ON public.skills USING btree (name);


--
-- Name: ix_user_activities_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_user_activities_id ON public.user_activities USING btree (id);


--
-- Name: ix_user_progress_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_user_progress_id ON public.user_progress USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: domain_progress domain_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domain_progress
    ADD CONSTRAINT domain_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: job_skill job_skill_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_skill
    ADD CONSTRAINT job_skill_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: job_skill job_skill_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_skill
    ADD CONSTRAINT job_skill_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;


--
-- Name: roadmaps roadmaps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roadmaps
    ADD CONSTRAINT roadmaps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: skill_progress skill_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_progress
    ADD CONSTRAINT skill_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_activities user_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_progress user_progress_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.interview_questions(id);


--
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict MdnJRnAEbN1fPKbCmbNGawyQcfadFf4BmUEVCpwJCEq4eHH5NZFHJGWnLlE5RCP

