import resend
from config.settings import get_settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Initialize Resend
if settings.resend_api_key:
    resend.api_key = settings.resend_api_key

class EmailService:
    """Email service using Resend API."""
    
    @staticmethod
    async def send_password_reset_email(email: str, reset_token: str, user_name: Optional[str] = None) -> bool:
        """Send password reset email."""
        try:
            if not settings.resend_api_key:
                logger.warning("Resend API key not configured. Email not sent.")
                return False
            
            # Create reset URL
            reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
            
            # Email content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your InspectIQ Password</title>
                <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
                    .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                    .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                    .security-note {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Reset Your Password</h1>
                        <p>InspectIQ Password Reset Request</p>
                    </div>
                    <div class="content">
                        <p>Hello{f" {user_name}" if user_name else ""},</p>
                        
                        <p>We received a request to reset your InspectIQ password. If you made this request, click the button below to reset your password:</p>
                        
                        <div style="text-align: center;">
                            <a href="{reset_url}" class="button">Reset My Password</a>
                        </div>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace;">
                            {reset_url}
                        </p>
                        
                        <div class="security-note">
                            <strong>⚠️ Security Notice:</strong>
                            <ul>
                                <li>This link will expire in <strong>24 hours</strong></li>
                                <li>If you didn't request this reset, please ignore this email</li>
                                <li>Never share this link with anyone</li>
                            </ul>
                        </div>
                        
                        <p>If you're having trouble with the button above, you can also reset your password by:</p>
                        <ol>
                            <li>Going to <a href="{settings.frontend_url}/forgot-password">InspectIQ Password Reset</a></li>
                            <li>Entering your email address</li>
                            <li>Following the instructions in the new email</li>
                        </ol>
                    </div>
                    <div class="footer">
                        <p>This email was sent by InspectIQ - AI-Powered Property Inspection Software</p>
                        <p>If you have questions, contact us at support@inspect-iq.app</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            text_content = f"""
            Reset Your InspectIQ Password
            
            Hello{f" {user_name}" if user_name else ""},
            
            We received a request to reset your InspectIQ password. If you made this request, visit this link to reset your password:
            
            {reset_url}
            
            Security Notice:
            - This link will expire in 24 hours
            - If you didn't request this reset, please ignore this email
            - Never share this link with anyone
            
            If you're having trouble, go to {settings.frontend_url}/forgot-password and request a new reset link.
            
            This email was sent by InspectIQ - AI-Powered Property Inspection Software
            If you have questions, contact us at support@inspect-iq.app
            """
            
            # Send email using Resend
            params = {
                "from": f"InspectIQ <noreply@{settings.email_domain}>",
                "to": [email],
                "subject": "Reset Your InspectIQ Password",
                "html": html_content,
                "text": text_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Password reset email sent successfully to {email}. Email ID: {response.get('id')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send password reset email to {email}: {str(e)}")
            return False
    
    @staticmethod
    async def send_welcome_email(email: str, user_name: str) -> bool:
        """Send welcome email to new users."""
        try:
            if not settings.resend_api_key:
                logger.warning("Resend API key not configured. Welcome email not sent.")
                return False
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to InspectIQ!</title>
                <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
                    .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                    .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                    .feature {{ background: white; padding: 20px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #667eea; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Welcome to InspectIQ!</h1>
                        <p>Your AI-Powered Property Inspection Journey Starts Now</p>
                    </div>
                    <div class="content">
                        <p>Hello {user_name},</p>
                        
                        <p>Welcome to InspectIQ! We're excited to help you revolutionize your property inspections with the power of AI.</p>
                        
                        <div style="text-align: center;">
                            <a href="{settings.frontend_url}/app" class="button">Start Your First Inspection</a>
                        </div>
                        
                        <h3>🚀 What you can do with InspectIQ:</h3>
                        
                        <div class="feature">
                            <strong>📸 AI-Powered Photo Analysis</strong><br>
                            Upload photos and get instant AI analysis of potential issues, damage, and maintenance needs.
                        </div>
                        
                        <div class="feature">
                            <strong>📋 Professional Reports</strong><br>
                            Generate comprehensive PDF reports with photos, analysis, and recommendations in minutes.
                        </div>
                        
                        <div class="feature">
                            <strong>🏠 Property Management</strong><br>
                            Organize multiple properties and track inspection history over time.
                        </div>
                        
                        <div class="feature">
                            <strong>⚖️ Code Compliance</strong><br>
                            Get state-specific building code guidance and violation detection.
                        </div>
                        
                        <h3>📚 Quick Start Guide:</h3>
                        <ol>
                            <li><strong>Add a Property:</strong> Start by adding your first property</li>
                            <li><strong>Create Inspection:</strong> Begin a new inspection for that property</li>
                            <li><strong>Upload Photos:</strong> Take or upload photos of different rooms/areas</li>
                            <li><strong>AI Analysis:</strong> Let our AI analyze the photos for issues</li>
                            <li><strong>Generate Report:</strong> Create a professional PDF report</li>
                        </ol>
                        
                        <p>Need help? Check out our <a href="{settings.frontend_url}/how-ai-works">How AI Works</a> guide or <a href="{settings.frontend_url}/contact">contact our support team</a>.</p>
                    </div>
                    <div class="footer">
                        <p>Happy inspecting!</p>
                        <p>The InspectIQ Team</p>
                        <p>Questions? Reply to this email or visit <a href="{settings.frontend_url}/contact">our support page</a></p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            Welcome to InspectIQ!
            
            Hello {user_name},
            
            Welcome to InspectIQ! We're excited to help you revolutionize your property inspections with the power of AI.
            
            Get started: {settings.frontend_url}/app
            
            What you can do with InspectIQ:
            
            📸 AI-Powered Photo Analysis
            Upload photos and get instant AI analysis of potential issues, damage, and maintenance needs.
            
            📋 Professional Reports  
            Generate comprehensive PDF reports with photos, analysis, and recommendations in minutes.
            
            🏠 Property Management
            Organize multiple properties and track inspection history over time.
            
            ⚖️ Code Compliance
            Get state-specific building code guidance and violation detection.
            
            Quick Start Guide:
            1. Add a Property: Start by adding your first property
            2. Create Inspection: Begin a new inspection for that property  
            3. Upload Photos: Take or upload photos of different rooms/areas
            4. AI Analysis: Let our AI analyze the photos for issues
            5. Generate Report: Create a professional PDF report
            
            Need help? Visit {settings.frontend_url}/how-ai-works or contact our support team at {settings.frontend_url}/contact
            
            Happy inspecting!
            The InspectIQ Team
            """
            
            params = {
                "from": f"InspectIQ <welcome@{settings.email_domain}>",
                "to": [email],
                "subject": "🎉 Welcome to InspectIQ - Let's Get Started!",
                "html": html_content,
                "text": text_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Welcome email sent successfully to {email}. Email ID: {response.get('id')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send welcome email to {email}: {str(e)}")
            return False