# Excel File Structure for Afriq-AI-Ranking

Your Excel file should have the following structure for successful upload:

## Required Columns:
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Country | Indicator | Value | Year |

## Sample Data:
```
Country         | Indicator                | Value | Year
Morocco         | Internet Penetration     | 74.4  | 2025
Morocco         | Digital Infrastructure   | 68.2  | 2025
Morocco         | AI Research Papers       | 125   | 2025
Morocco         | GDP per Capita           | 3876  | 2025
Algeria         | Internet Penetration     | 61.0  | 2025
Algeria         | Digital Infrastructure   | 55.8  | 2025
Algeria         | AI Research Papers       | 98    | 2025
Egypt           | Internet Penetration     | 57.3  | 2025
Egypt           | Digital Infrastructure   | 62.1  | 2025
Egypt           | AI Research Papers       | 156   | 2025
Tunisia         | Internet Penetration     | 66.7  | 2025
Tunisia         | Digital Infrastructure   | 59.4  | 2025
Tunisia         | AI Research Papers       | 87    | 2025
```

## Important Notes:

1. **Country Names**: Must exactly match those in the database:
   - Algeria, Egypt, Morocco, Tunisia, Nigeria, Ghana, Kenya, South Africa, etc.

2. **Indicator Names**: Must exactly match those in the database:
   - Internet Penetration
   - Digital Infrastructure  
   - AI Research Papers
   - AI Patents
   - R&D Investment
   - AI Startups
   - Tech Talent Pool
   - University AI Programs
   - AI Strategy
   - Data Protection Laws
   - Digital ID Systems
   - Public AI Investment
   - Regulatory Framework
   - Digital Literacy Rate
   - STEM Education
   - Technical Training Programs
   - AI Course Availability
   - ICT Skills
   - GDP per Capita
   - Innovation Index
   - Business Environment
   - Venture Capital Investment
   - Technology Adoption Rate

3. **File Requirements**:
   - Save as `.xlsx` format
   - First row should contain headers
   - No empty rows between data
   - Values should be numeric (decimals allowed)

4. **API Usage**:
   - Upload via: `POST {{baseUrl}}/api/v1/admin/upload/process`
   - Set `overwriteExisting=true` if you want to update existing scores 