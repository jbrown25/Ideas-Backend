require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./config/database');

const User = require('./models/user');
const Idea = require('./models/idea');
const Rating = require('./models/rating');
const Submission = require('./models/submission');

const {seedData} = require('./seed');

const app = express();

//configure app
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'})); //all json api
app.use(cors()); //just let everyone in for now

//configure routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const ideaRoutes = require('./routes/idea');
app.use('/idea', ideaRoutes);

const ratingRoutes = require('./routes/rating');
app.use('/rating', ratingRoutes);

const submissionRoutes = require('./routes/submission');
app.use('/submission', submissionRoutes);

app.use('/', (req, res, next) => {
	res.status(404).send({errorMessage: 'boy you lost'});
});

//define db relationships
Idea.belongsTo(User);
User.hasMany(Idea);

User.hasMany(Rating);
Idea.hasMany(Rating);
Rating.belongsTo(User);
Rating.belongsTo(Idea);

User.hasMany(Submission);
Idea.hasMany(Submission);
Submission.belongsTo(User);
Submission.belongsTo(Idea);

//start app
sequelize.sync({force: true})
//sequelize.sync()
	.then(async (result) => {
		//console.log(result);
		await seedData();
		app.listen(process.env.PORT || 8080, () => {
			console.log('server started');
		});
	})
	.catch(err => console.log(err));