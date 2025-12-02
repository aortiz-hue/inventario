import React from 'react';
import { Info } from 'lucide-react';
import accendoLogo from '../assets/accendo-logo.png';

const AboutPage = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">Acerca de...</h1>

            <div className="card about-card">
                <div className="about-header">
                    <img src={accendoLogo} alt="Accendo Industry" className="about-logo" />
                    <h2>Sistema de Inventarios</h2>
                </div>

                <div className="about-content">
                    <p>
                        Este software es propiedad de <strong>Accendo Industry SA de CV</strong>.
                        <br />
                        Todos los derechos reservados.
                    </p>

                    <div className="contact-info">
                        <p>Para ventas, capacitación o actualizaciones, visitar el sitio:</p>
                        <a
                            href="https://www.accendoindustry.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="website-link"
                        >
                            https://www.accendoindustry.com
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .about-card {
                    max-width: 600px;
                    margin: 0 auto;
                    text-align: center;
                    padding: var(--spacing-xl);
                }

                .about-header {
                    margin-bottom: var(--spacing-xl);
                }

                .about-logo {
                    height: 80px;
                    width: auto;
                    margin-bottom: var(--spacing-md);
                }

                .about-content {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: var(--color-text);
                }

                .contact-info {
                    margin-top: var(--spacing-xl);
                    padding-top: var(--spacing-lg);
                    border-top: 1px solid var(--color-border);
                }

                .website-link {
                    color: var(--color-primary);
                    font-weight: 500;
                    text-decoration: none;
                }

                .website-link:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default AboutPage;
