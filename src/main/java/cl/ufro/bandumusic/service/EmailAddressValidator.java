package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.exception.ValidacionAutenticacionException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.InitialDirContext;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class EmailAddressValidator {

    private static final Pattern LOCAL_PART_PATTERN = Pattern.compile("^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$");
    private static final Pattern DOMAIN_LABEL_PATTERN = Pattern.compile("^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$");

    private final boolean dnsValidationEnabled;
    private final Set<String> blockedDomains;

    public EmailAddressValidator(
            @Value("${app.email-validation.dns-enabled:true}") boolean dnsValidationEnabled,
            @Value("${app.email-validation.blocked-domains:example.com,example.org,example.net,test.com,nose.com,mailinator.com,tempmail.com,10minutemail.com}") String blockedDomains
    ) {
        this.dnsValidationEnabled = dnsValidationEnabled;
        this.blockedDomains = Arrays.stream(blockedDomains.split(","))
                .map(domain -> domain.trim().toLowerCase(Locale.ROOT))
                .filter(domain -> !domain.isBlank())
                .collect(Collectors.toUnmodifiableSet());
    }

    public String validarYNormalizar(String correo) {
        String normalizado = correo == null ? "" : correo.trim().toLowerCase(Locale.ROOT);
        validarFormatoEstricto(normalizado);

        String domain = normalizado.substring(normalizado.lastIndexOf('@') + 1);
        if (blockedDomains.contains(domain)) {
            throw new ValidacionAutenticacionException("El dominio del correo no esta permitido. Usa un proveedor de correo valido.");
        }

        if (dnsValidationEnabled && !tieneRegistrosDeCorreo(domain)) {
            throw new ValidacionAutenticacionException("El dominio del correo no tiene registros DNS validos para recibir emails.");
        }

        return normalizado;
    }

    private void validarFormatoEstricto(String correo) {
        try {
            InternetAddress address = new InternetAddress(correo, true);
            address.validate();
        } catch (AddressException ex) {
            throw new ValidacionAutenticacionException("El correo no tiene un formato valido.");
        }

        int atIndex = correo.lastIndexOf('@');
        if (atIndex <= 0 || atIndex != correo.indexOf('@') || atIndex == correo.length() - 1) {
            throw new ValidacionAutenticacionException("El correo no tiene un formato valido.");
        }

        String localPart = correo.substring(0, atIndex);
        String domain = correo.substring(atIndex + 1);
        if (localPart.length() > 64 || !LOCAL_PART_PATTERN.matcher(localPart).matches()) {
            throw new ValidacionAutenticacionException("El correo contiene caracteres no permitidos.");
        }
        if (domain.length() > 253 || !domain.contains(".") || domain.startsWith(".") || domain.endsWith(".")) {
            throw new ValidacionAutenticacionException("El dominio del correo no es valido.");
        }

        for (String label : domain.split("\\.")) {
            if (!DOMAIN_LABEL_PATTERN.matcher(label).matches()) {
                throw new ValidacionAutenticacionException("El dominio del correo no es valido.");
            }
        }
    }

    private boolean tieneRegistrosDeCorreo(String domain) {
        return tieneRegistroDns(domain, "MX") || tieneRegistroDns(domain, "A") || tieneRegistroDns(domain, "AAAA");
    }

    private boolean tieneRegistroDns(String domain, String recordType) {
        Hashtable<String, String> env = new Hashtable<>();
        env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");

        try {
            Attributes attributes = new InitialDirContext(env).getAttributes(domain, new String[]{recordType});
            Attribute attribute = attributes.get(recordType);
            return attribute != null && attribute.size() > 0;
        } catch (NamingException ex) {
            return false;
        }
    }
}
