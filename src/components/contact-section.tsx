'use client'

import { motion } from 'framer-motion'
import { config } from '@/lib/config'
import { 
  Mail, 
  Github, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  Phone,
  Video,
  FileText,
  Users,
  Globe
} from 'lucide-react'
import { Section } from './section'
import { contactInfo } from '@/lib/data'
import { cn } from '@/lib/utils'

const ContactMethod = ({ 
  icon: Icon, 
  title, 
  description, 
  preferred = false,
  href,
  external = false
}: { 
  icon: any, 
  title: string, 
  description: string, 
  preferred?: boolean,
  href?: string,
  external?: boolean
}) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300',
        preferred && 'border-2 border-primary/30 bg-primary/5'
      )}
    >
      {preferred && (
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Preferred</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className={cn(
          'p-3 rounded-lg',
          preferred ? 'bg-primary/20' : 'bg-primary/10'
        )}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <a 
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block focus-ring rounded-lg"
      >
        {content}
      </a>
    )
  }

  return content
}

const InfoCard = ({ icon: Icon, label, value }: { 
  icon: any, 
  label: string, 
  value: string 
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-primary/20 rounded-lg">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  </div>
)

const PreferenceCard = ({ icon: Icon, title, items }: { 
  icon: any, 
  title: string, 
  items: string[] 
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-primary/20 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
)

export function ContactSection() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Best for detailed discussions, project proposals, and formal communications',
      preferred: true,
      href: `mailto:${contactInfo.email}`,
      external: false
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'View my code, contribute to projects, or discuss technical implementations',
      preferred: false,
      href: contactInfo.github,
      external: true
    },
    {
      icon: MessageSquare,
      title: 'Text-based Chat',
      description: 'Quick questions, technical discussions, and project coordination',
      preferred: true,
      href: `mailto:${contactInfo.email}?subject=Chat%20Request`,
      external: false
    }
  ]

  const workTypes = []
  if (contactInfo.workPreferences.fullTime) workTypes.push('Full-time')
  if (contactInfo.workPreferences.contract) workTypes.push('Contract')
  if (contactInfo.workPreferences.partTime) workTypes.push('Part-time')

  return (
    <Section 
      id="contact" 
      title="Let's Connect"
      subtitle="Looking for a technical engineer who can build, deploy, and maintain complex systems? Let's discuss how I can help your team."
      background="gradient"
    >
      {/* Availability Status */}
      <div className="mb-16">
        <div className="glass rounded-lg p-8 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400 capitalize">
              {contactInfo.availability.replace('-', ' ')}
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Currently Available</h3>
          <p className="text-muted-foreground mb-6">
            Ready to take on new challenges in infrastructure, backend systems, or full-stack development. 
            Interested in both short-term consulting and long-term opportunities.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            icon={MapPin}
            label="Location"
            value={contactInfo.location}
          />
          <InfoCard
            icon={Clock}
            label="Timezone"
            value={contactInfo.timezone}
          />
          <InfoCard
            icon={Calendar}
            label="Response Time"
            value="Usually within 24 hours"
          />
          <InfoCard
            icon={Users}
            label="Team Size"
            value="Remote work, distributed teams"
          />
        </div>
      </div>

      {/* Contact Methods */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">Get in Touch</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <ContactMethod key={index} {...method} />
          ))}
        </div>
      </div>

      {/* Work Preferences */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">Work Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PreferenceCard
            icon={MessageSquare}
            title="Communication"
            items={contactInfo.preferredCommunication}
          />
          <PreferenceCard
            icon={Calendar}
            title="Work Types"
            items={workTypes}
          />
          <PreferenceCard
            icon={Globe}
            title="Remote Work"
            items={['Fully remote', 'Distributed teams', 'Async collaboration', 'Flexible hours']}
          />
        </div>
      </div>

      {/* Communication Style */}
      <div className="mb-16">
        <div className="glass rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">Communication Style</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Preferred Methods
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Email for detailed discussions and project planning</li>
                <li>• Text-based chat for quick questions and coordination</li>
                <li>• Documentation and written specifications</li>
                <li>• Asynchronous communication across time zones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                Limited Availability
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Phone calls by appointment only</li>
                <li>• Video calls for initial meetings or complex discussions</li>
                <li>• Prefer written follow-ups for all verbal communications</li>
                <li>• Response time may vary for real-time communications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
          <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Ready to Start?</h3>
          <p className="text-muted-foreground mb-6">
            Whether you have a specific project in mind or want to discuss potential opportunities, 
            I'd love to hear from you. Let's build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${contactInfo.email}?subject=Project%20Inquiry&body=Hi%20${encodeURIComponent(config.OWNER_NAME.split(' ')[0])},%0D%0A%0D%0AI'm%20interested%20in%20discussing%20a%20potential%20opportunity.%20Here%20are%20some%20details:%0D%0A%0D%0AProject%20Type:%20%0D%0ADuration:%20%0D%0ATech%20Stack:%20%0D%0ATeam%20Size:%20%0D%0A%0D%0ALooking%20forward%20to%20hearing%20from%20you!`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email Me
            </a>
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
            >
              <Github className="h-4 w-4" />
              GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
} 