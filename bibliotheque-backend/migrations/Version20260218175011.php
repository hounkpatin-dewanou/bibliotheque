<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218175011 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE livre ADD description LONGTEXT NOT NULL, ADD genre VARCHAR(100) NOT NULL, ADD annee_publication INT NOT NULL, ADD nb_pages INT NOT NULL, ADD langue VARCHAR(50) NOT NULL, ADD image VARCHAR(255) NOT NULL, ADD nb_exemplaires INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE livre DROP description, DROP genre, DROP annee_publication, DROP nb_pages, DROP langue, DROP image, DROP nb_exemplaires');
    }
}
