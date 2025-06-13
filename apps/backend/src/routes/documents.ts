import { Router } from 'express';
import { Document, IDocument } from '../models/Document';

const router = Router();

// ყველა დოკუმენტის მიღება
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    console.error('დოკუმენტების მიღების შეცდომა:', error);
    res.status(500).json({ error: 'სერვერის შეცდომა' });
  }
});

// მომხმარებლის დოკუმენტების მიღება
router.get('/my', async (req, res) => {
  try {
    // TODO: დავამატოთ ავთენტიფიკაცია
    const userId = '000000000000000000000000'; // დროებითი userId
    const documents = await Document.find({ authorId: userId });
    res.json(documents);
  } catch (error) {
    console.error('მომხმარებლის დოკუმენტების მიღების შეცდომა:', error);
    res.status(500).json({ error: 'სერვერის შეცდომა' });
  }
});

// ერთი დოკუმენტის მიღება ID-ით
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'დოკუმენტი ვერ მოიძებნა' });
    }
    res.json(document);
  } catch (error) {
    console.error('დოკუმენტის მიღების შეცდომა:', error);
    res.status(500).json({ error: 'სერვერის შეცდომა' });
  }
});

// ახალი დოკუმენტის შექმნა
router.post('/', async (req, res) => {
  try {
    console.log('მიღებული მონაცემები:', JSON.stringify(req.body, null, 2));
    
    // შევამოწმოთ აუცილებელი ველები
    const requiredFields = [
      'evaluatorName',
      'evaluatorLastName',
      'objectName',
      'workDescription',
      'date',
      'time',
      'hazardIdentification',
      'injuryDescription',
      'existingControlMeasures',
      'initialRisk',
      'additionalControlMeasures',
      'residualRisk',
      'requiredMeasures',
      'responsiblePerson',
      'reviewDate'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      console.log('აკლია ველები:', missingFields);
      return res.status(400).json({ 
        error: 'აკლია აუცილებელი ველები',
        fields: missingFields
      });
    }

    // შევამოწმოთ რისკის ველები
    if (!req.body.initialRisk?.probability || !req.body.initialRisk?.severity || !req.body.initialRisk?.total) {
      return res.status(400).json({ 
        error: 'აკლია საწყისი რისკის ველები',
        fields: ['initialRisk']
      });
    }

    if (!req.body.residualRisk?.probability || !req.body.residualRisk?.severity || !req.body.residualRisk?.total) {
      return res.status(400).json({ 
        error: 'აკლია ნარჩენი რისკის ველები',
        fields: ['residualRisk']
      });
    }

    // გადავაკონვერტიროთ თარიღები
    const documentData = {
      ...req.body,
      date: new Date(req.body.date),
      reviewDate: new Date(req.body.reviewDate),
      authorId: '000000000000000000000000', // დროებითი userId
      isFavorite: false,
      assessmentA: 0,
      assessmentSh: 0,
      assessmentR: 0
    };

    console.log('შექმნის მცდარობა დოკუმენტის...');
    const document = new Document(documentData);

    console.log('დოკუმენტის შენახვის მცდარობა...');
    const savedDocument = await document.save();
    console.log('შენახული დოკუმენტი:', JSON.stringify(savedDocument, null, 2));
    res.status(201).json(savedDocument);
  } catch (error) {
    console.error('დოკუმენტის შენახვის შეცდომა:', error);
    console.error('შეცდომის დეტალები:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'სერვერის შეცდომა',
      details: error.message 
    });
  }
});

// დოკუმენტის განახლება
router.put('/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ error: 'დოკუმენტი ვერ მოიძებნა' });
    }
    res.json(document);
  } catch (error) {
    console.error('დოკუმენტის განახლების შეცდომა:', error);
    res.status(500).json({ error: 'სერვერის შეცდომა' });
  }
});

// დოკუმენტის წაშლა
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'დოკუმენტი ვერ მოიძებნა' });
    }
    res.json({ message: 'დოკუმენტი წარმატებით წაიშალა' });
  } catch (error) {
    console.error('დოკუმენტის წაშლის შეცდომა:', error);
    res.status(500).json({ error: 'სერვერის შეცდომა' });
  }
});

// დოკუმენტის ფავორიტად მონიშვნა/მოხსნა
router.post('/:id/favorite', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'დოკუმენტი ვერ მოიძებნა' });
    }
    document.isFavorite = !document.isFavorite;
    await document.save();
    res.json(document);
  } catch (error) {
    console.error('დოკუმენტის ფავორიტად მონიშვნის შეცდომა:', error);
    res.status(500).json({ error: 'სერვერის შეცდომა' });
  }
});

// დოკუმენტის შეფასების განახლება
router.patch('/:id/assessment', async (req, res) => {
  try {
    const { assessmentA, assessmentSh, assessmentR } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { assessmentA, assessmentSh, assessmentR },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ error: 'დოკუმენტი ვერ მოიძებნა' });
    }
    res.json(document);
  } catch (error) {
    console.error('დოკუმენტის შეფასების განახლების შეცდომა:', error);
    res.status(500).json({ error: 'სერვერის შეცდომა' });
  }
});

export default router; 