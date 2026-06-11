package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.exception.IntegracionExternaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final boolean mailEnabled;
    private final String mailFrom;
    private final String mailHost;
    private final String mailUsername;
    private final String mailPassword;
    private final boolean smtpAuthEnabled;

    public EmailService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${app.mail.enabled:false}") boolean mailEnabled,
            @Value("${app.mail.from:no-reply@bandumusic.local}") String mailFrom,
            @Value("${spring.mail.host:}") String mailHost,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${spring.mail.password:}") String mailPassword,
            @Value("${spring.mail.properties.mail.smtp.auth:true}") boolean smtpAuthEnabled
    ) {
        this.mailSenderProvider = mailSenderProvider;
        this.mailEnabled = mailEnabled;
        this.mailFrom = mailFrom;
        this.mailHost = mailHost;
        this.mailUsername = mailUsername;
        this.mailPassword = mailPassword;
        this.smtpAuthEnabled = smtpAuthEnabled;
    }

    public void enviarCodigoVerificacion(String destinatario, String nombreUsuario, String codigo, long expirationMinutes) {
        if (!mailEnabled) {
            LOGGER.info("Codigo de verificacion para {}: {} (expira en {} minutos)", destinatario, codigo, expirationMinutes);
            return;
        }

        validarConfiguracionSmtp();

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            throw new IntegracionExternaException("El envio de correo esta habilitado, pero JavaMailSender no esta configurado.");
        }

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(mailFrom);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Codigo de verificacion BanduMusic");
        mensaje.setText("""
                Hola %s,

                Tu codigo de verificacion BanduMusic es:
                %s

                El codigo expira en %d minutos. No lo compartas con nadie.

                Si no creaste esta cuenta, puedes ignorar este correo.
                """.formatted(nombreUsuario, codigo, expirationMinutes));
        try {
            mailSender.send(mensaje);
            LOGGER.info("Codigo de verificacion enviado a {} usando SMTP {}", destinatario, mailHost);
        } catch (MailException ex) {
            LOGGER.error("No fue posible enviar el codigo de verificacion a {} usando SMTP {}", destinatario, mailHost, ex);
            throw new IntegracionExternaException("No fue posible enviar el codigo de verificacion. Revisa la configuracion SMTP del servidor.");
        }
    }

    public void enviarCodigoRecuperacion(String destinatario, String nombreUsuario, String codigo, long expirationMinutes) {
        if (!mailEnabled) {
            LOGGER.info("Codigo de recuperacion de contrasena para {}: {} (expira en {} minutos)", destinatario, codigo, expirationMinutes);
            return;
        }

        validarConfiguracionSmtp();

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            throw new IntegracionExternaException("El envio de correo esta habilitado, pero JavaMailSender no esta configurado.");
        }

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(mailFrom);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Codigo para restablecer tu contrasena BanduMusic");
        mensaje.setText("""
                Hola %s,

                Recibimos una solicitud para restablecer tu contrasena de BanduMusic.
                Tu codigo de recuperacion es:
                %s

                El codigo expira en %d minutos. No lo compartas con nadie.

                Si no solicitaste este cambio, puedes ignorar este correo.
                """.formatted(nombreUsuario, codigo, expirationMinutes));
        try {
            mailSender.send(mensaje);
            LOGGER.info("Codigo de recuperacion enviado a {} usando SMTP {}", destinatario, mailHost);
        } catch (MailException ex) {
            LOGGER.error("No fue posible enviar el codigo de recuperacion a {} usando SMTP {}", destinatario, mailHost, ex);
            throw new IntegracionExternaException("No fue posible enviar el codigo de recuperacion. Revisa la configuracion SMTP del servidor.");
        }
    }

    private void validarConfiguracionSmtp() {
        if (estaVacio(mailHost)) {
            throw new IntegracionExternaException("MAIL_ENABLED esta activo, pero MAIL_HOST no esta configurado.");
        }
        if (estaVacio(mailFrom) || mailFrom.endsWith("@bandumusic.local")) {
            throw new IntegracionExternaException("MAIL_ENABLED esta activo, pero MAIL_FROM debe ser un correo remitente real.");
        }
        if (smtpAuthEnabled && (estaVacio(mailUsername) || estaVacio(mailPassword))) {
            throw new IntegracionExternaException("MAIL_ENABLED esta activo con autenticacion SMTP, pero MAIL_USERNAME o MAIL_PASSWORD no estan configurados.");
        }
    }

    private boolean estaVacio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}
