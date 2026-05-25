import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'HI Agent Backend API',
    version: '1.0.0',
    description: 'API documentation for the HI Agent backend service.'
  },
  servers: [
    {
      url: '/',
      description: 'Current Environment'
    }
  ],
  paths: {
    '/webhook/vapi': {
      post: {
        summary: 'Vapi End-of-Call Webhook',
        description: 'Receives the end-of-call payload from Vapi.ai, saves the call to the database, and emails the transcript to the owner.',
        parameters: [
          {
            in: 'header',
            name: 'x-vapi-secret',
            required: true,
            schema: { type: 'string' },
            description: 'Must match VAPI_WEBHOOK_SECRET'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', example: 'end-of-call-report' },
                      call: { type: 'object' },
                      transcript: { type: 'string' },
                      summary: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Webhook received successfully'
          },
          '401': {
            description: 'Unauthorized (Invalid x-vapi-secret header)'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    },
    '/api/contact': {
      post: {
        summary: 'Submit Contact Form',
        description: 'Receives contact form submissions from the frontend.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  businessName: { type: 'string', example: 'Doe Plumbing' },
                  email: { type: 'string', example: 'john@example.com' },
                  phone: { type: 'string', example: '555-1234' },
                  message: { type: 'string', example: 'I need an AI voice agent.' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Form submitted successfully'
          },
          '400': {
            description: 'Validation Error (Missing name or email)'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    }
  }
}

export function setupSwagger(app: Application) {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
