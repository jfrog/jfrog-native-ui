export default class DockerLayersWidgetController {
    constructor($animate, $timeout,ArtifactoryFeatures) {
        this.$animate = $animate;
        this.$timeout = $timeout;
        this.features = ArtifactoryFeatures;
        this.tabs = [
            "Layers",
            "Security Vulnerabilities"
        ];
        this.activeTab = "Layers"

        this.mockData = [
            {
                "id": "XRAY-70720",
                "severity": "High",
                "summary": "libelf/elf_end.c in elfutils 0.173 allows remote attackers to cause a denial of service (double free and application crash) or possibly have unspecified other impact because it tries to decompress twice.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:elfutils",
                "source_id": "deb://debian:stretch:elfutils",
                "source_comp_id": "deb://debian:stretch:elfutils:0.168-1",
                "component_versions": {
                    "id": "debian:stretch:elfutils",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-16402",
                                "cwe": [
                                    "CWE-415"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "libelf/elf_end.c in elfutils 0.173 allows remote attackers to cause a denial of service (double free and application crash) or possibly have unspecified other impact because it tries to decompress twice.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:47:00Z"
            },
            {
                "id": "XRAY-41464",
                "severity": "High",
                "summary": "Tools/faqwiz/move-faqwiz.sh (aka the generic FAQ wizard moving tool) in Python 2.4.5 might allow local users to overwrite arbitrary files via a symlink attack on a tmp$RANDOM.tmp temporary file.  NOTE: there may not be common usage scenarios in which tmp$RANDOM.tmp is located in an untrusted directory.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:python-defaults",
                "source_id": "deb://debian:stretch:python-defaults",
                "source_comp_id": "deb://debian:stretch:python-defaults:2.7.13-2",
                "component_versions": {
                    "id": "debian:stretch:python-defaults",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2008-4108",
                                "cwe": [
                                    "CWE-59"
                                ],
                                "cvss_v2": "7.2/CVSS:2.0/AV:L/AC:L/Au:N/C:C/I:C/A:C"
                            }
                        ],
                        "description": "Tools/faqwiz/move-faqwiz.sh (aka the generic FAQ wizard moving tool) in Python 2.4.5 might allow local users to overwrite arbitrary files via a symlink attack on a tmp$RANDOM.tmp temporary file.  NOTE: there may not be common usage scenarios in which tmp$RANDOM.tmp is located in an untrusted directory.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:48:45Z"
            },
            {
                "id": "XRAY-53872",
                "severity": "High",
                "summary": "The xdr_bytes and xdr_string functions in the GNU C Library (aka glibc or libc6) 2.25 mishandle failures of buffer deserialization, which allows remote attackers to cause a denial of service (virtual memory allocation, or memory consumption if an overcommit setting is not used) via a crafted UDP packet to port 111, a related issue to CVE-2017-8779.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:glibc",
                "source_id": "deb://debian:stretch:glibc",
                "source_comp_id": "deb://debian:stretch:glibc:2.24-11+deb9u4",
                "component_versions": {
                    "id": "debian:stretch:glibc",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-8804",
                                "cwe": [
                                    "CWE-502"
                                ],
                                "cvss_v2": "7.8/CVSS:2.0/AV:N/AC:L/Au:N/C:N/I:N/A:C",
                                "cvss_v3": "7.5/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H"
                            }
                        ],
                        "description": "The xdr_bytes and xdr_string functions in the GNU C Library (aka glibc or libc6) 2.25 mishandle failures of buffer deserialization, which allows remote attackers to cause a denial of service (virtual memory allocation, or memory consumption if an overcommit setting is not used) via a crafted UDP packet to port 111, a related issue to CVE-2017-8779.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-01-21T12:53:51Z"
            },
            {
                "id": "XRAY-75785",
                "severity": "High",
                "summary": "In the GNU C Library (aka glibc or libc6) through 2.29, proceed_next_node in posix/regexec.c has a heap-based buffer over-read via an attempted case-insensitive regular-expression match.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:glibc",
                "source_id": "deb://debian:stretch:glibc",
                "source_comp_id": "deb://debian:stretch:glibc:2.24-11+deb9u4",
                "component_versions": {
                    "id": "debian:stretch:glibc",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2019-9169",
                                "cwe": [
                                    "CWE-125"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "In the GNU C Library (aka glibc or libc6) through 2.29, proceed_next_node in posix/regexec.c has a heap-based buffer over-read via an attempted case-insensitive regular-expression match.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:49:55Z"
            },
            {
                "id": "XRAY-57714",
                "severity": "High",
                "summary": "In shadow before 4.5, the newusers tool could be made to manipulate internal data structures in ways unintended by the authors. Malformed input may lead to crashes (with a buffer overflow or other memory corruption) or other unspecified behaviors. This crosses a privilege boundary in, for example, certain web-hosting environments in which a Control Panel allows an unprivileged user account to create subaccounts.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:shadow",
                "source_id": "deb://debian:stretch:shadow",
                "source_comp_id": "deb://debian:stretch:shadow:1:4.4-4.1",
                "component_versions": {
                    "id": "debian:stretch:shadow",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-12424",
                                "cwe": [
                                    "CWE-119"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "In shadow before 4.5, the newusers tool could be made to manipulate internal data structures in ways unintended by the authors. Malformed input may lead to crashes (with a buffer overflow or other memory corruption) or other unspecified behaviors. This crosses a privilege boundary in, for example, certain web-hosting environments in which a Control Panel allows an unprivileged user account to create subaccounts.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:52:43Z"
            },
            {
                "id": "XRAY-75672",
                "severity": "High",
                "summary": "Go before 1.8.7, Go 1.9.x before 1.9.4, and Go 1.10 pre-releases before Go 1.10rc2 allow \"go get\" remote command execution during source code build, by leveraging the gcc or clang plugin feature, because -fplugin= and -plugin= arguments were not blocked.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "github.com/golang/go",
                "source_id": "go://github.com/golang/go",
                "source_comp_id": "go://github.com/golang/go:1.8.1",
                "component_versions": {
                    "id": "github.com/golang/go",
                    "vulnerable_versions": [
                        "< 1.8.7",
                        "1.9.0 ≤ Version < 1.9.4",
                        "1.10 ≤ Version < 1.10rc2"
                    ],
                    "fixed_versions": [
                        "1.8.7",
                        "1.9.4",
                        "1.10rc2"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-6574",
                                "cwe": [
                                    "CWE-284"
                                ],
                                "cvss_v2": "7.5/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "Go before 1.8.7, Go 1.9.x before 1.9.4, and Go 1.10 pre-releases before Go 1.10rc2 allow \"go get\" remote command execution during source code build, by leveraging the gcc or clang plugin feature, because -fplugin= and -plugin= arguments were not blocked.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-03-03T08:34:41Z"
            },
            {
                "id": "XRAY-63998",
                "severity": "High",
                "summary": "The malloc implementation in the GNU C Library (aka glibc or libc6), from version 2.24 to 2.26 on powerpc, and only in version 2.26 on i386, did not properly handle malloc calls with arguments close to SIZE_MAX and could return a pointer to a heap region that is smaller than requested, eventually leading to heap corruption.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:glibc",
                "source_id": "deb://debian:stretch:glibc",
                "source_comp_id": "deb://debian:stretch:glibc:2.24-11+deb9u4",
                "component_versions": {
                    "id": "debian:stretch:glibc",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-6551",
                                "cwe": [
                                    "CWE-119"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "The malloc implementation in the GNU C Library (aka glibc or libc6), from version 2.24 to 2.26 on powerpc, and only in version 2.26 on i386, did not properly handle malloc calls with arguments close to SIZE_MAX and could return a pointer to a heap region that is smaller than requested, eventually leading to heap corruption.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:49:28Z"
            },
            {
                "id": "XRAY-70175",
                "severity": "High",
                "summary": "GNU Libtasn1-4.13 libtasn1-4.13 version libtasn1-4.13, libtasn1-4.12 contains a DoS, specifically CPU usage will reach 100% when running asn1Paser against the POC due to an issue in _asn1_expand_object_id(p_tree), after a long time, the program will be killed. This attack appears to be exploitable via parsing a crafted file.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:libtasn1-6",
                "source_id": "deb://debian:stretch:libtasn1-6",
                "source_comp_id": "deb://debian:stretch:libtasn1-6:4.10-1.1+deb9u1",
                "component_versions": {
                    "id": "debian:stretch:libtasn1-6",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-1000654",
                                "cwe": [
                                    "CWE-399"
                                ],
                                "cvss_v2": "7.1/CVSS:2.0/AV:N/AC:M/Au:N/C:N/I:N/A:C",
                                "cvss_v3": "5.5/CVSS:3.0/AV:L/AC:L/PR:N/UI:R/S:U/C:N/I:N/A:H"
                            }
                        ],
                        "description": "GNU Libtasn1-4.13 libtasn1-4.13 version libtasn1-4.13, libtasn1-4.12 contains a DoS, specifically CPU usage will reach 100% when running asn1Paser against the POC due to an issue in _asn1_expand_object_id(p_tree), after a long time, the program will be killed. This attack appears to be exploitable via parsing a crafted file.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:46:58Z"
            },
            {
                "id": "XRAY-58069",
                "severity": "High",
                "summary": "Double free vulnerability in MIT Kerberos 5 (aka krb5) allows attackers to have unspecified impact via vectors involving automatic deletion of security contexts on error.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:krb5",
                "source_id": "deb://debian:stretch:krb5",
                "source_comp_id": "deb://debian:stretch:krb5:1.15-1+deb9u1",
                "component_versions": {
                    "id": "debian:stretch:krb5",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-11462",
                                "cwe": [
                                    "CWE-415"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "Double free vulnerability in MIT Kerberos 5 (aka krb5) allows attackers to have unspecified impact via vectors involving automatic deletion of security contexts on error.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:49:15Z"
            },
            {
                "id": "XRAY-59545",
                "severity": "High",
                "summary": "plugins/preauth/pkinit/pkinit_crypto_openssl.c in MIT Kerberos 5 (aka krb5) through 1.15.2 mishandles Distinguished Name (DN) fields, which allows remote attackers to execute arbitrary code or cause a denial of service (buffer overflow and application crash) in situations involving untrusted X.509 data, related to the get_matching_data and X509_NAME_oneline_ex functions. NOTE: this has security relevance only in use cases outside of the MIT Kerberos distribution, e.g., the use of get_matching_data in KDC certauth plugin code that is specific to Red Hat.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:krb5",
                "source_id": "deb://debian:stretch:krb5",
                "source_comp_id": "deb://debian:stretch:krb5:1.15-1+deb9u1",
                "component_versions": {
                    "id": "debian:stretch:krb5",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-15088",
                                "cwe": [
                                    "CWE-119"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "plugins/preauth/pkinit/pkinit_crypto_openssl.c in MIT Kerberos 5 (aka krb5) through 1.15.2 mishandles Distinguished Name (DN) fields, which allows remote attackers to execute arbitrary code or cause a denial of service (buffer overflow and application crash) in situations involving untrusted X.509 data, related to the get_matching_data and X509_NAME_oneline_ex functions. NOTE: this has security relevance only in use cases outside of the MIT Kerberos distribution, e.g., the use of get_matching_data in KDC certauth plugin code that is specific to Red Hat.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:53:00Z"
            },
            {
                "id": "XRAY-75846",
                "severity": "High",
                "summary": "The crypto/x509 package of Go before 1.10.6 and 1.11.x before 1.11.3 does not limit the amount of work performed for each chain verification, which might allow attackers to craft pathological inputs leading to a CPU denial of service. Go TLS servers accepting client certificates and TLS clients are affected.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "github.com/golang/go",
                "source_id": "go://github.com/golang/go",
                "source_comp_id": "go://github.com/golang/go:1.8.1",
                "component_versions": {
                    "id": "github.com/golang/go",
                    "vulnerable_versions": [
                        "< 1.10.6",
                        "1.11 ≤ Version < 1.11.3"
                    ],
                    "fixed_versions": [
                        "1.10.6",
                        "1.11.3"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-16875",
                                "cwe": [
                                    "CWE-295"
                                ],
                                "cvss_v2": "7.8/AV:N/AC:L/Au:N/C:N/I:N/A:C",
                                "cvss_v3": "7.5/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H"
                            }
                        ],
                        "description": "The crypto/x509 package of Go before 1.10.6 and 1.11.x before 1.11.3 does not limit the amount of work performed for each chain verification, which might allow attackers to craft pathological inputs leading to a CPU denial of service. Go TLS servers accepting client certificates and TLS clients are affected.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-03-05T10:18:19Z"
            },
            {
                "id": "XRAY-56410",
                "severity": "High",
                "summary": "systemd v233 and earlier fails to safely parse usernames starting with a numeric digit (e.g. \"0day\"), running the service in question with root privileges rather than the user intended.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:systemd",
                "source_id": "deb://debian:stretch:systemd",
                "source_comp_id": "deb://debian:stretch:systemd:232-25+deb9u12",
                "component_versions": {
                    "id": "debian:stretch:systemd",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-1000082",
                                "cwe": [
                                    "CWE-20"
                                ],
                                "cvss_v2": "10.0/CVSS:2.0/AV:N/AC:L/Au:N/C:C/I:C/A:C",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "systemd v233 and earlier fails to safely parse usernames starting with a numeric digit (e.g. \"0day\"), running the service in question with root privileges rather than the user intended.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:49:10Z"
            },
            {
                "id": "XRAY-79857",
                "severity": "High",
                "summary": "Go before 1.8.4 and 1.9.x before 1.9.1 allows \"go get\" remote command execution. Using custom domains, it is possible to arrange things so that example.com/pkg1 points to a Subversion repository but example.com/pkg1/pkg2 points to a Git repository. If the Subversion repository includes a Git checkout in its pkg2 directory and some other work is done to ensure the proper ordering of operations, \"go get\" can be tricked into reusing this Git checkout for the fetch of code from pkg2. If the Subversion repository's Git checkout has malicious commands in .git/hooks/, they will execute on the system running \"go get.\"",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "github.com/golang/go",
                "source_id": "go://github.com/golang/go",
                "source_comp_id": "go://github.com/golang/go:1.8.1",
                "component_versions": {
                    "id": "github.com/golang/go",
                    "vulnerable_versions": [
                        "< 1.8.4",
                        "1.9.0 ≤ Version < 1.9.1"
                    ],
                    "fixed_versions": [
                        "1.8.4",
                        "1.9.1"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-15041",
                                "cwe": [
                                    "CWE-284"
                                ],
                                "cvss_v2": "7.5/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "Go before 1.8.4 and 1.9.x before 1.9.1 allows \"go get\" remote command execution. Using custom domains, it is possible to arrange things so that example.com/pkg1 points to a Subversion repository but example.com/pkg1/pkg2 points to a Git repository. If the Subversion repository includes a Git checkout in its pkg2 directory and some other work is done to ensure the proper ordering of operations, \"go get\" can be tricked into reusing this Git checkout for the fetch of code from pkg2. If the Subversion repository's Git checkout has malicious commands in .git/hooks/, they will execute on the system running \"go get.\"",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-05-21T10:16:27Z"
            },
            {
                "id": "XRAY-71229",
                "severity": "High",
                "summary": "In GNOME GLib 2.56.1, g_markup_parse_context_end_parse() in gmarkup.c has a NULL pointer dereference.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:glib2.0",
                "source_id": "deb://debian:stretch:glib2.0",
                "source_comp_id": "deb://debian:stretch:glib2.0:2.50.3-2+deb9u1",
                "component_versions": {
                    "id": "debian:stretch:glib2.0",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-16428",
                                "cwe": [
                                    "CWE-476"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "In GNOME GLib 2.56.1, g_markup_parse_context_end_parse() in gmarkup.c has a NULL pointer dereference.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:47:00Z"
            },
            {
                "id": "XRAY-81447",
                "severity": "High",
                "summary": "In all versions of AppArmor mount rules are accidentally widened when compiled.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:apparmor",
                "source_id": "deb://debian:stretch:apparmor",
                "source_comp_id": "deb://debian:stretch:apparmor:2.11.0-3+deb9u2",
                "component_versions": {
                    "id": "debian:stretch:apparmor",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2016-1585",
                                "cwe": [
                                    "CWE-254"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "In all versions of AppArmor mount rules are accidentally widened when compiled.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:49:59Z"
            },
            {
                "id": "XRAY-64004",
                "severity": "High",
                "summary": "An integer overflow in the implementation of the posix_memalign in memalign functions in the GNU C Library (aka glibc or libc6) 2.26 and earlier could cause these functions to return a pointer to a heap area that is too small, potentially leading to heap corruption.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:glibc",
                "source_id": "deb://debian:stretch:glibc",
                "source_comp_id": "deb://debian:stretch:glibc:2.24-11+deb9u4",
                "component_versions": {
                    "id": "debian:stretch:glibc",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-6485",
                                "cwe": [
                                    "CWE-190"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "An integer overflow in the implementation of the posix_memalign in memalign functions in the GNU C Library (aka glibc or libc6) 2.26 and earlier could cause these functions to return a pointer to a heap area that is too small, potentially leading to heap corruption.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:53:12Z"
            },
            {
                "id": "XRAY-65882",
                "severity": "High",
                "summary": "systemd-tmpfiles in systemd through 237 mishandles symlinks present in non-terminal path components, which allows local users to obtain ownership of arbitrary files via vectors involving creation of a directory and a file under that directory, and later replacing that directory with a symlink. This occurs even if the fs.protected_symlinks sysctl is turned on.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:systemd",
                "source_id": "deb://debian:stretch:systemd",
                "source_comp_id": "deb://debian:stretch:systemd:232-25+deb9u12",
                "component_versions": {
                    "id": "debian:stretch:systemd",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-6954",
                                "cwe": [
                                    "CWE-264"
                                ],
                                "cvss_v2": "7.2/CVSS:2.0/AV:L/AC:L/Au:N/C:C/I:C/A:C",
                                "cvss_v3": "7.8/CVSS:3.0/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "systemd-tmpfiles in systemd through 237 mishandles symlinks present in non-terminal path components, which allows local users to obtain ownership of arbitrary files via vectors involving creation of a directory and a file under that directory, and later replacing that directory with a symlink. This occurs even if the fs.protected_symlinks sysctl is turned on.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:53:17Z"
            },
            {
                "id": "XRAY-40740",
                "severity": "High",
                "summary": "runuser in util-linux allows local users to escape to the parent session via a crafted TIOCSTI ioctl call, which pushes characters to the terminal's input buffer.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:util-linux",
                "source_id": "deb://debian:stretch:util-linux",
                "source_comp_id": "deb://debian:stretch:util-linux:2.29.2-1+deb9u1",
                "component_versions": {
                    "id": "debian:stretch:util-linux",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2016-2779",
                                "cwe": [
                                    "CWE-264"
                                ],
                                "cvss_v2": "7.2/CVSS:2.0/AV:L/AC:L/Au:N/C:C/I:C/A:C",
                                "cvss_v3": "7.8/CVSS:3.0/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "runuser in util-linux allows local users to escape to the parent session via a crafted TIOCSTI ioctl call, which pushes characters to the terminal's input buffer.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:51:34Z"
            },
            {
                "id": "XRAY-82071",
                "severity": "High",
                "summary": "Go through 1.12.5 on Windows mishandles process creation with a nil environment in conjunction with a non-nil token, which allows attackers to obtain sensitive information or gain privileges.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "github.com/golang/go",
                "source_id": "go://github.com/golang/go",
                "source_comp_id": "go://github.com/golang/go:1.8.1",
                "component_versions": {
                    "id": "github.com/golang/go",
                    "vulnerable_versions": [
                        "≤ 1.11.11",
                        "1.12 ≤ Version ≤ 1.12.5"
                    ],
                    "fixed_versions": [
                        "1.12.6",
                        "1.13beta1"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2019-11888",
                                "cwe": [
                                    "CWE-264"
                                ],
                                "cvss_v2": "7.5/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "Go through 1.12.5 on Windows mishandles process creation with a nil environment in conjunction with a non-nil token, which allows attackers to obtain sensitive information or gain privileges.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-01T12:47:36Z"
            },
            {
                "id": "XRAY-58088",
                "severity": "High",
                "summary": "Integer overflow in the decode_digit function in puny_decode.c in Libidn2 before 2.0.4 allows remote attackers to cause a denial of service or possibly have unspecified other impact.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:libidn",
                "source_id": "deb://debian:stretch:libidn",
                "source_comp_id": "deb://debian:stretch:libidn:1.33-1",
                "component_versions": {
                    "id": "debian:stretch:libidn",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-14062",
                                "cwe": [
                                    "CWE-190"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "Integer overflow in the decode_digit function in puny_decode.c in Libidn2 before 2.0.4 allows remote attackers to cause a denial of service or possibly have unspecified other impact.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:52:48Z"
            },
            {
                "id": "XRAY-83115",
                "severity": "High",
                "summary": "SQLite3 from 3.6.0 to and including 3.27.2 is vulnerable to heap out-of-bound read in the rtreenode() function when handling invalid rtree tables.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:sqlite3",
                "source_id": "deb://debian:stretch:sqlite3",
                "source_comp_id": "deb://debian:stretch:sqlite3:3.16.2-5+deb9u1",
                "component_versions": {
                    "id": "debian:stretch:sqlite3",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2019-8457",
                                "cwe": [
                                    "CWE-125"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "SQLite3 from 3.6.0 to and including 3.27.2 is vulnerable to heap out-of-bound read in the rtreenode() function when handling invalid rtree tables.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:47:34Z"
            },
            {
                "id": "XRAY-83112",
                "severity": "High",
                "summary": "file_copy_fallback in gio/gfile.c in GNOME GLib 2.15.0 through 2.61.1 does not properly restrict file permissions while a copy operation is in progress. Instead, default permissions are used.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:glib2.0",
                "source_id": "deb://debian:stretch:glib2.0",
                "source_comp_id": "deb://debian:stretch:glib2.0:2.50.3-2+deb9u1",
                "component_versions": {
                    "id": "debian:stretch:glib2.0",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2019-12450",
                                "cwe": [
                                    "CWE-275"
                                ],
                                "cvss_v2": "7.5/CVSS:2.0/AV:N/AC:L/Au:N/C:P/I:P/A:P",
                                "cvss_v3": "9.8/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "file_copy_fallback in gio/gfile.c in GNOME GLib 2.15.0 through 2.61.1 does not properly restrict file permissions while a copy operation is in progress. Instead, default permissions are used.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:50:00Z"
            },
            {
                "id": "XRAY-60416",
                "severity": "High",
                "summary": "In glibc 2.26 and earlier there is confusion in the usage of getcwd() by realpath() which can be used to write before the destination buffer leading to a buffer underflow and potential code execution.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:glibc",
                "source_id": "deb://debian:stretch:glibc",
                "source_comp_id": "deb://debian:stretch:glibc:2.24-11+deb9u4",
                "component_versions": {
                    "id": "debian:stretch:glibc",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2018-1000001",
                                "cwe": [
                                    "CWE-119"
                                ],
                                "cvss_v2": "7.2/CVSS:2.0/AV:L/AC:L/Au:N/C:C/I:C/A:C",
                                "cvss_v3": "7.8/CVSS:3.0/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H"
                            }
                        ],
                        "description": "In glibc 2.26 and earlier there is confusion in the usage of getcwd() by realpath() which can be used to write before the destination buffer leading to a buffer underflow and potential code execution.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:49:25Z"
            },
            {
                "id": "XRAY-56484",
                "severity": "High",
                "summary": "In PCRE 8.41, the OP_KETRMAX feature in the match function in pcre_exec.c allows stack exhaustion (uncontrolled recursion) when processing a crafted regular expression.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:pcre3",
                "source_id": "deb://debian:stretch:pcre3",
                "source_comp_id": "deb://debian:stretch:pcre3:2:8.39-3",
                "component_versions": {
                    "id": "debian:stretch:pcre3",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2017-11164",
                                "cwe": [
                                    "CWE-399"
                                ],
                                "cvss_v2": "7.8/CVSS:2.0/AV:N/AC:L/Au:N/C:N/I:N/A:C",
                                "cvss_v3": "7.5/CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H"
                            }
                        ],
                        "description": "In PCRE 8.41, the OP_KETRMAX feature in the match function in pcre_exec.c allows stack exhaustion (uncontrolled recursion) when processing a crafted regular expression.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-25T12:49:10Z"
            },
            {
                "id": "XRAY-28223",
                "severity": "High",
                "summary": "Tar 1.15.1 does not properly warn the user when extracting setuid or setgid files, which may allow local users or remote attackers to gain privileges.",
                "issue_type": "security",
                "provider": "JFrog",
                "component": "debian:stretch:tar",
                "source_id": "deb://debian:stretch:tar",
                "source_comp_id": "deb://debian:stretch:tar:1.29b-1.1",
                "component_versions": {
                    "id": "debian:stretch:tar",
                    "vulnerable_versions": [
                        "All Versions"
                    ],
                    "more_details": {
                        "cves": [
                            {
                                "cve": "CVE-2005-2541",
                                "cwe": [
                                    "NVD-CWE-Other"
                                ],
                                "cvss_v2": "10.0/CVSS:2.0/AV:N/AC:L/Au:N/C:C/I:C/A:C"
                            }
                        ],
                        "description": "Tar 1.15.1 does not properly warn the user when extracting setuid or setgid files, which may allow local users or remote attackers to gain privileges.",
                        "provider": "JFrog"
                    }
                },
                "edited": "2019-08-23T12:47:54Z"
            }
        ]
    }

    $onInit() {
        this.subRouter = this.$scope.versionCtrl.subRouter;
        console.log(this.subRouter);
        this.package_id = `${this.subRouter.params.packageType}://${this.subRouter.params.package}`;
        this.version = this.subRouter.params.version;
        this.$animate.enabled(this.$element, true);
        this.$timeout(() => {
            //$('.widget-wrapper').prepend($('.nav-tabs'))
            //$('.content-wrapper').animate({ scrollTop: "0" }, 400);

        })

    }

    tabClicked(tab) {
        this.activeTab = tab
        $('.content-wrapper').animate({scrollTop: "0"}, 400);
    }

    isActive(tab) {
        return this.activeTab === tab;
    }

}