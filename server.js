const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/african_elephants');
const { STRING, DECIMAL } = Sequelize;

const Year = conn.define('year', {
    name: {
        type: STRING
    }
});

const Population = conn.define('population', {
    count: {
        type: STRING
    },
    popRatio: {
        type: DECIMAL
    }
});

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    let years = await Promise.all(
        ['2015', '2013', '2006', '1989', '1987', '1976', 'early1800s'].map( name => Year.create({ name }))
    );
    
    years = years.reduce((acc, year) => {
        acc[year.name] = year;
        return acc;
    }, {});
    
    const populations = await Promise.all([
        Population.create({ yearId: years[2015].id, count: '415,428', popRatio: 1.55 }),
        Population.create({ yearId: years[2013].id, count: '426,293', popRatio: 1.58 }),
        Population.create({ yearId: years[2006].id, count: '508,325', popRatio: 1.89 }),
        Population.create({ yearId: years[1989].id, count: '608,000', popRatio: 2.26 }),
        Population.create({ yearId: years[1987].id, count: '760,000', popRatio: 2.82 }),
        Population.create({ yearId: years[1976].id, count: '1,340,000', popRatio: 4.98 }),
        Population.create({ yearId: years.early1800s.id, count: '26,913,000', popRatio: 100 })
    ]);
    return {
        years,
        populations
    };
}

Population.belongsTo(Year);

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.get('/public', (req, res, next)=> res.sendFile(path.join(__dirname, '/public/index.html')))

app.get('/api/years', async(req, res, next)=> {
    try{
        res.send(await Year.findAll())
    }
    catch(ex){
        next(ex);
    }
})

app.get('/api/populations', async(req, res, next)=>{
    try{
        res.send(await Population.findAll())
    }
    catch(ex){
        next(ex);
    }
})

app.get('/api/years/:yearId/populations', async(req,res,next)=>{
    try{
        const response = await Population.findAll({
            where: { yearId: req.params.yearId },
            include: [ Year ]
        })
        res.send(response)
    }
    catch(ex){
        next(ex);
    }
})

app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send({ error: err.message });
})

const init = async() => {
    try{
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, ()=>console.log(`listening on ${port}`))
    }
    catch(ex){
        console.log(ex)
    }
}

init();

