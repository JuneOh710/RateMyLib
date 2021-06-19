import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/rateMyLib', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(console.log('Database connected'))
    .catch(err => console.log('connection error:', err))

const librarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

const Library = mongoose.model('Library', librarySchema)

const libraries = [];
const l_names = ['Advancement, Central Libraries', 'Architecture, Landscape, and Design (Eberhard Zeidler Library)', 'Astronomy & Astrophysics Library', 'Bindery, Central Libraries', 'Books & Serials Acquisitions', 'Business (Milt Harris Library, Rotman School of Management)', 'Business Services, Central Libraries', 'Capital Projects and Planning, Central Libraries', 'Career Resource Library, Koffler Centre ', 'Centre for Criminology Library', 'Chemistry Library (A D Allen)', 'Collection Development Department', 'Communications, Central Libraries', 'Data Centre and Staff Technology Unit (ITS)', 'Dentistry Library (Harry R Abbott)', 'Department of Art Library', 'Digital Library Unit (ITS)', 'Digital Preservation Unit (ITS)', 'Digital Scholarship Unit (ITS)', 'Dr. Chun Resource Library (Centre for Women and Trans People & OPIRG)', 'Earth Sciences Library (Noranda)', 'East Asian Library (Cheng Yu Tung)', 'Engineering & Computer Science Library', 'Faculty Liaison & Information Literacy', 'Financial Services, Central Libraries', 'First Nations House Library', 'Gail Brooker Ceramic Research Library at the Gardiner Museum ', 'Gerstein Science Information Centre', 'Hart House Library', 'Health Science Information Consortium of Toronto', 'Human Resources, Central Libraries', 'Industrial Relations and Human Resources Library (Newman)', 'Information Commons', 'Information Technology Services (ITS)', 'Inforum, Faculty of Information', 'Innis College Library', 'Institute for Christian Studies', 'Knox College Library (Caven)', 'Law Library (Bora Laskin)', 'Licensing and e-Resource Acquisitions', 'Map and Data Library ', 'Massey College Library (Robertson Davies)', 'Mathematical Sciences Library', 'Media Commons', 'Metadata Services', 'Metadata Technologies', 'Music Library', 'New College Library (Ivey)', 'Office of the Chief Librarian, Central Libraries', 'OISE Library', 'Petro Jacyk Central & East European Resource Centre', 'Physics Library', 'Pontifical Institute of Mediaeval Studies Library', 'Regis College Library', 'Richard Charles Lee Canada-Hong Kong Library', 'Robarts Library', 'Royal Ontario Museum Library & Archives', 'Scholarly Communications & Copyright Office', 'Security, Health and Safety, Central Libraries', 'St. Michael’s College - John M. Kelly Library', 'Teaching & Learning Project', 'Thomas Fisher Rare Book Library', 'Trinity College Library (John W Graham Library)', 'University College Library', 'UofT Archives & Records Management Services (UTARMS)', 'User Services, Robarts Library', 'Victoria University - Centre for Renaissance and Reformation Studies', 'Victoria University - E J Pratt Library', 'Victoria University - Emmanuel College Library']
for (let l of l_names) {
    libraries.push({
        name: l,
        location: 'toronto'
    })
}
const deleteAllAndInsertMany = async () => {
    await Library.deleteMany({})
    await Library.insertMany(libraries)
}

deleteAllAndInsertMany()
