all:
	echo build done

install:

	# lokkit-web
	mkdir -p ${DESTDIR}/var/www/lokkit-web
	cp -r dist/* ${DESTDIR}/var/www/lokkit-web

	# nginx config and certs
	mkdir -p ${DESTDIR}/etc/nginx/sites-enabled/
	cp nginx.conf ${DESTDIR}/etc/nginx/sites-enabled/lokkit-web
	mkdir -p ${DESTDIR}/etc/ssl/certs
	mkdir -p ${DESTDIR}/etc/ssl/private
	cp certs/cert.pem ${DESTDIR}/etc/ssl/certs/lokkit-web.pem
	cp certs/key.pem ${DESTDIR}/etc/ssl/private/lokkit-web.pem

gen_certs:
	openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -subj "/C=CH/ST=ZUG/L=Rotkreuz/O=lokkit.io/OU=webapp/CN=webapp.lokkit.io" -nodes
