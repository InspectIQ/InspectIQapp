from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from datetime import datetime
import markdown2


class PDFGenerator:
    """Generate PDF reports from inspection data."""
    
    @staticmethod
    def generate_inspection_report(inspection_data: dict) -> BytesIO:
        """
        Generate a PDF report for an inspection.
        
        Args:
            inspection_data: Dictionary containing inspection details
            
        Returns:
            BytesIO object containing the PDF
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0284c7'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#0369a1'),
            spaceAfter=12,
            spaceBefore=12
        )
        
        # Title
        story.append(Paragraph("InspectIQ Inspection Report", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Property Information
        if inspection_data.get('property'):
            prop = inspection_data['property']
            story.append(Paragraph("Property Information", heading_style))
            
            prop_data = [
                ['Address:', prop.get('address_line1', 'N/A')],
                ['City:', f"{prop.get('city', 'N/A')}, {prop.get('state', 'N/A')} {prop.get('postal_code', 'N/A')}"],
            ]
            if prop.get('property_type'):
                prop_data.append(['Type:', prop['property_type'].capitalize()])
            
            prop_table = Table(prop_data, colWidths=[1.5*inch, 4.5*inch])
            prop_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(prop_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Inspection Details
        story.append(Paragraph("Inspection Details", heading_style))
        
        insp_data = [
            ['Type:', inspection_data.get('inspection_type', 'N/A').replace('_', ' ').title()],
            ['Date:', datetime.fromisoformat(inspection_data.get('inspection_date', '')).strftime('%B %d, %Y') if inspection_data.get('inspection_date') else 'N/A'],
            ['Status:', inspection_data.get('status', 'N/A').capitalize()],
        ]
        
        insp_table = Table(insp_data, colWidths=[1.5*inch, 4.5*inch])
        insp_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(insp_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Summary Statistics
        if inspection_data.get('summary_stats'):
            summary = inspection_data['summary_stats']
            story.append(Paragraph("Summary", heading_style))
            
            summary_data = [
                ['Issues Found:', str(summary.get('issue_count', 0))],
                ['Overall Severity:', summary.get('summary_severity', 'N/A').capitalize()],
                ['Estimated Cost:', f"${summary.get('summary_cost_low', 0):.2f} - ${summary.get('summary_cost_high', 0):.2f}"],
            ]
            
            summary_table = Table(summary_data, colWidths=[1.5*inch, 4.5*inch])
            summary_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0f9ff')),
            ]))
            story.append(summary_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Issues
        if inspection_data.get('issues_enriched'):
            story.append(Paragraph("Detected Issues", heading_style))
            
            for idx, issue in enumerate(inspection_data['issues_enriched'], 1):
                # Issue header
                issue_title = f"{idx}. {issue.get('issue_type', 'Issue').replace('_', ' ').title()}"
                if issue.get('room_name'):
                    issue_title += f" - {issue['room_name']}"
                
                story.append(Paragraph(issue_title, styles['Heading3']))
                
                # Issue details
                issue_details = [
                    ['Severity:', issue.get('severity', 'N/A').capitalize()],
                    ['Description:', issue.get('description', 'N/A')],
                ]
                
                if issue.get('recommended_action'):
                    issue_details.append(['Recommended Action:', issue['recommended_action']])
                
                if issue.get('cost_low') and issue.get('cost_high'):
                    issue_details.append(['Estimated Cost:', f"${issue['cost_low']:.2f} - ${issue['cost_high']:.2f}"])
                
                if issue.get('diy_possible') is not None:
                    issue_details.append(['DIY Possible:', 'Yes' if issue['diy_possible'] else 'No'])
                
                issue_table = Table(issue_details, colWidths=[1.5*inch, 4.5*inch])
                issue_table.setStyle(TableStyle([
                    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                    ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                story.append(issue_table)
                story.append(Spacer(1, 0.2*inch))
        
        # Footer
        story.append(Spacer(1, 0.5*inch))
        footer_text = f"Generated by InspectIQ on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        story.append(Paragraph(footer_text, styles['Normal']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
